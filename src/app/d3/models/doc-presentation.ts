const MainDetailsInterface = [
    {"Title" : ""},
    {"Uniform Title" : ""}, 
    {"Creator" : ""}, 
    {"Name" : ""}, 
    {"Contributors" : ""}, 
    {"Description" : ""}, 
    {"Language" : ""}, 
    {"Series" : ""}, 
    {"Serial Title" : ""}, 
    {"Edition": ""}
]
const PublicationDetailsInterface = [
    {"Publisher" : ""}, 
    {"Publication Year" : ""}, 
    {"Additional Publication Year" : ""}, 
    {"Publisher Number" : ""}, 
    {"Shelving Location" : ""}, 
    {"Country of Publication": ""}
]
const IdentifiersNumbersDetailsInterface = [
    {"ISBN" : ""}, 
    {"ISSN" : ""}, 
    {"ISSN Link" : ""}, 
    {"DOI" : ""}, 
    {"Dewey Decimal Class Number" : ""}, 
    {"MMS ID" : ""}, 
    {"Government Document Number" : ""}, 
    {"LC Call Number" : ""}, 
    {"LCCN" : ""}, 
    {"NLM Type Call Number" : ""}, 
    {"National Bibliography Number" : ""}, 
    {"Other Classification Number" : ""}, 
    {"Other Standard Number" : ""}, 
    {"Other System Number" : ""}, 
    {"Source Record ID" : ""}, 
    {"Standard Number": ""}
]
const ResourceDetailsInterface = [
    {"Physical Description" : ""}, 
    {"Physical Details" : ""}, 
    {"Accompanying Material" : ""}, 
    {"Genre Form" : ""}, 
    {"Carrier Type Term" : ""}, 
    {"Content Type Term" : ""}, 
    {"Media Type Term" : ""}, 
    {"Medium Type" : ""}, 
    {"Classification" : ""}, 
    {"Coded Catrographic Mathematical Data" : ""}, 
    {"Content Related Data" : ""}, 
    {"Date Type Status" : ""}, 
    {"Geographic Area Code" : ""}, 
    {"Media Type Code" : ""}, 
    {"Carrier Type Code" : ""}, 
    {"Content Type Code" : ""}, 
    {"Sublocation" : ""}, 
    {"Relator": ""}
]
const NotesInterface = [
    {"Notes" : ""}, 
    {"Additional Physical Form Available Note" : ""}, 
    {"Copyright Note" : ""}, 
    {"Electronic location and note" : ""}, 
    {"Public Note" : ""}
]
const TopicalSubjectsInterface = [
    {"Subjects" : ""}, 
    {"Topics" : ""}, 
    {"Subject Category Code" : ""}
]
const UncategorizedMetadataInterface = [
    {"Uncategorized Metadata" : ""}
]
export const DocPresentationInterface = [
    {"Main_Details" : MainDetailsInterface},
    {"Publication_Details": PublicationDetailsInterface},
    {"Identifiers_and_Numbers": IdentifiersNumbersDetailsInterface},
    {"Resource_Details": ResourceDetailsInterface},
    {"Notes":NotesInterface},
    {"Topical_Subjects": TopicalSubjectsInterface},
    {"Uncategorized_Metadata": UncategorizedMetadataInterface}
]