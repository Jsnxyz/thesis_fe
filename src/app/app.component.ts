import { Component, OnInit } from '@angular/core';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3';
import { Client } from 'elasticsearch-browser';
import { SearchService } from './search.service';
import {NgxPaginationModule} from 'ngx-pagination';
import * as d3 from 'd3';
import { xml } from 'd3';

interface Facets {
    Subjects?: any;
    Publication_Year?: any;
    Publisher_Name?: any;
    Contributors?: any;
    Topics?: any;
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    nodes: Node[] = [];
    links: Link[] = [];
    realLinks: Link[] = [];
    client: Client;
    graphResults: any = [];
    docResults: any = [];
    searchBoxText: string = "";
    savedSearchText: string = "";
    facets: Facets = {};
    selectedFacets: Facets = {};
    totalDocs = 0;
    currentPage = 1;

    resultPageToggle = false;
    openedDoc:any;

    topicNodeInput:string;
    topicList: string[] = [];
    showTopicList = false;
    centerNode = "";
    getKeys(object: {}) {
        return Object.keys(object);
    }
    constructor(private es: SearchService) {
    }
    ngOnInit() {
        this.es.makeConnections()
            .then(response => {
                const N = response.aggregations.nodes.buckets.length,
                    getIndex = number => number - 1;
                let nodes: Node[] = [];
                this.graphResults = response.aggregations.nodes.buckets;
                this.loadFacets(response.aggregations);
                let max = 0;
                this.graphResults.forEach(element => {
                    if (element.doc_count > max) {
                        max = element.doc_count;
                    }
                });
                for (let node of this.graphResults) {
                    nodes.push(new Node(node.key, max));
                    this.topicList.push(node.key);
                }
                let nodeIter = 0;
                for (let node of this.graphResults) {
                    for (let edge of node.edges.buckets) {
                        if (edge.key !== node.key) {
                            nodes[nodeIter].linkCount = node.doc_count;
                        }
                    }
                    nodeIter++;
                }
                this.nodes = nodes;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            }
            );


    }
    removeUnderscore(text) {
        return text.replace("_", " ");
    }
    loadFacets(aggs) {
        this.facets.Contributors = aggs.contributors_facet ? aggs.contributors_facet.buckets : [];
        this.facets.Publisher_Name = aggs.publisher_facet ? aggs.publisher_facet.buckets : [];
        this.facets.Publication_Year = aggs.publication_year_facet ? aggs.publication_year_facet.buckets : [];
        this.facets.Subjects = aggs.subject_facet ? aggs.subject_facet.buckets : [];
    }

    openLinks(key) {
        let nodeIndex = this.graphResults.findIndex(function (item, i) {
            return item.key === key
        });
        let links: Link[] = [];
        if(this.graphResults[nodeIndex]){
            for (let edge of this.graphResults[nodeIndex].edges.buckets) {
                if (edge.key !== key) {
                    links.push(new Link(key, edge.key));
                }
            }
            this.links = links;
            this.getResultByTopics(key, this.searchBoxText);
        }
    }
    //getNetwork
    getGraphAndDocs(text) {
        this.savedSearchText = text;
        this.selectedFacets = {};
        this.getNetwork(text);
        this.getResultDocs(text);
    }
    getNetwork(text) {
        this.links = [];
        this.es.searchGraph(text, this.selectedFacets)
            .then(response => {
                this.graphUpdate(response,true);
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
    getNetworkWithoutFacetUpdate(text){
        let facets = this.selectedFacets;
        let topicName:string;
        if(this.selectedFacets.Topics[0]){
            topicName = this.selectedFacets.Topics[0];
        }
        facets.Topics = [];
        this.es.getGraphNoFacetUpdate(text, facets)
            .then(response => {
                this.links = [];
                this.graphUpdate(response,false);
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
                setTimeout(() => {
                    if(topicName){
                        this.openLinks(topicName);
                    }
                },1000)
                
            });
        
    }
    graphUpdate(response, loadFacet) {
        const N = response.aggregations.nodes.buckets.length,
            getIndex = number => number - 1;
        let nodes: Node[] = [];
        this.graphResults = response.aggregations.nodes.buckets;
        if(loadFacet){
            this.loadFacets(response.aggregations);
        }
        let max = 0;
        this.graphResults.forEach(element => {
            if (element.doc_count > max) {
                max = element.doc_count;
            }
        });
        this.topicList = [];
        for (let node of this.graphResults) {
            nodes.push(new Node(node.key, max));
            this.topicList.push(node.key);
        }
        let nodeIter = 0;
        for (let node of this.graphResults) {
            for (let edge of node.edges.buckets) {
                if (edge.key !== node.key) {
                    nodes[nodeIter].linkCount = node.doc_count;
                }
            }
            nodeIter++;
        }
        this.nodes = nodes;
    }
    //get facets and hits. 
    getResultDocs(text,pageNo = 1) {
        this.es.getDocuments(text, this.selectedFacets,pageNo)
            .then(response => {
                this.docResults = response.hits.hits;
                this.totalDocs = response.hits.total;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
    getResultByTopics(topic, text) {
        text = text || "";
        this.selectedFacets.Topics = [topic];
        this.es.getDocuments(text, this.selectedFacets)
            .then(response => {
                this.docResults = response.hits.hits;
                this.totalDocs = response.hits.total;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
    limitText(text: any) {
        text = text.toString();
        if (text.length > 150) {
            text = text.toString().substr(0, 150) + " ..";
        } else {
            text = text.toString().substr(0, 150)
        }
        return text;
    }
    getUnique(arr) {
        return Array.from(new Set(arr));
    }
    facetClick(event, facet, facetKey) {
        if (event.target.checked) {
            this.selectedFacets[facet] = this.selectedFacets[facet] || [];
            this.selectedFacets[facet].push(facetKey);
        } else {
            const facetKeyIndex = this.selectedFacets[facet].findIndex(function (item, i) {
                return item === facetKey
            });
            this.selectedFacets[facet].splice(facetKeyIndex, 1);
        }
        this.getNetworkWithoutFacetUpdate(this.savedSearchText);
        this.getResultDocs(this.savedSearchText);
    }
    paginateClick(pageNo){
        this.currentPage = pageNo;
        this.getResultDocs(this.savedSearchText,pageNo);
    }
    openDoc(id){
        this.es.getDocument(id)
            .then(response => {
                this.openedDoc = response._source;
                this.resultPageToggle = true;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
    goBackToDocs(){
        this.resultPageToggle = false;
    }
    filterByTopicInput(){
        if(this.topicNodeInput){
            return this.topicList.filter( (item) => {
                if(item.includes(this.topicNodeInput)){
                    return true;
                }
                return false;
            })
        } 
        return this.topicList;
    }
    toggleTopicList(){
        this.showTopicList = !this.showTopicList;
    }
    delayToggleTopicList(){
        setTimeout(() => {
            this.showTopicList = false;
        },100);
    }
    centerTopic(topic:string){
        let nodeIndex = this.graphResults.findIndex(function (item, i) {
            return item.key === topic
        });
        let graphElement = document.querySelector("graph");
        let graph = d3.select(graphElement);
        let node = this.nodes[nodeIndex];
        let svgElement = document.querySelector('.mainGraphSvg');
        let containerElement = document.querySelector('.mainGraphContainer');
        
        let svg = d3.select(svgElement);
        let container = d3.select(containerElement);
        

        
        //container.attr('transform', 'translate(' + x + ',' + y + ') scale(' + t.k  + ')');
        
            const t = d3.zoomTransform(graph.node());
            let x = -Number(node.x);
            let y = -Number(node.y);
            x = x * t.k + (svgElement.clientWidth / 2);
            y = y * t.k + (svgElement.clientHeight / 2);
            let zoomed = () => {
                if(d3.event.transform != null) {
                    container.attr("transform", d3.event.transform );
                }
            }
    
            let zoom = d3.zoom().on('zoom', zoomed);
        svg.transition().duration(750).call( zoom.transform, d3.zoomIdentity.translate(x,y).scale(t.k) );
    }
}
