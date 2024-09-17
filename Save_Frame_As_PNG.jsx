

/* 
Script Name: Save Frame as PNG
Summary: Saves a PNG of the current frame in After Effects.
Features: 
    1. Allows user to add dynamic information into the file name using the dropdown and other tools.
    2. Allows user to choose where the file is saved using the file browser functionality.

Script Created by Blake Fealy
*/

function getProjectName() {
    if (app.project.file) {
        var projectFilePath = app.project.file.fsName; // Get the full file path
        var projectFileName = projectFilePath.split(slash).pop(); // Extract the file name from the path
        
        // Remove the file extension (e.g., .aep)
        var projectNameWithoutExtension = projectFileName.split('.').slice(0, -1).join('.'); 
        
        return projectNameWithoutExtension;
    } else {
        return "No project file";
    }
}

// Function to save the project
function saveProject() {
    var projectFile = app.project.file;
    var saved = null;
    if (projectFile) {
        // The project is already saved, so just save it again
        app.project.save(projectFile);
        alert("Project saved at: " + projectFile.fsName);
    } else {
        // The project is not saved, prompt the user to choose a location
        var saveFile = File.saveDialog("Save Project As");

        if (saveFile) {
           saved = app.project.save(saveFile);
        } else {
            saved = null;
        }
    }
}

//Determine OS
var osType = (File.fs === "Macintosh") ? "Macintosh" : "Windows";
var slash = (osType === "Windows") ? "\\" : "/";

//Upfront Variables
if(app.project.file === null){
    saveProject(); 
    saved = app.project.file;
} else {
    saved = app.project.file;
}

if(typeof saved === 'undefined'){
    Window.alert("Please save project to and try again","Save Required", true);
    } else {
var project = app.project;
var active = project.activeItem;

var compName = active.name;
var curTime = active.time;
var frameRate = active.frameRate;
var numFrames = Math.round(active.duration * frameRate);
var curFrame = Math.round(curTime * frameRate);

var numDigits = numFrames.toString().length;
var missingDigits = numDigits - curFrame.toString().length;
var formatFrame = (missingDigits > 0) 
    ? "0".repeat(missingDigits) + curFrame.toString() 
    : curFrame.toString();


var dropTokens = ["Project Name", "Comp Name", "Frame Number", "Today: Day", "Today: Year (yy)", "Today: Year (yyyy)", "Today: Month (mm)", "Today: Month (mmm)", "Today: Month (mmmm)", "Today: Hour", "Today: Minute", "Today: Second"];

var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    
var currentDate = new Date();
var day = currentDate.getDate();
var year = currentDate.getFullYear();
var shortYear = String(year)[2] + String(year)[3];
var month = currentDate.getMonth();
var monthName = months[month];
var abbMonth = monthName.slice(0, 3);
var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();

//START OF WINDOW
function scriptUI(thisObj) {
    var mainPanel = thisObj instanceof Panel ? thisObj : new Window("palette", "Quick PNG", undefined, {resizeable: true});


    // Get the current project path
    function getCurrentProjectFolder() {
        var projectFile = app.project.file;
        if (projectFile) {
                return projectFile.parent; // Get the parent folder of the project file
        } else {
                return null; // No project file open
        }
    }

    //OPTIONS
        //Options Panel Setup
    var optionsPanel = mainPanel.add("panel", undefined, "Quick File Naming Options");
    var firstRow = optionsPanel.add("group", undefined, {orientation: "row"});
    var secondRow = optionsPanel.add("group", undefined, {orientation: "row"});
    var thirdRow = optionsPanel.add("group", undefined, {orientation: "row"});
        //Options Variables
    var DropdownTitle = firstRow.add("staticText", undefined, "Variables: ")
    var nameDrop = firstRow.add("dropdownlist", undefined, dropTokens);
            nameDrop.preferredSize.height = 20;
    var addToName = firstRow.add("button", undefined, "Add");
            addToName.preferredSize.width = 30;
            addToName.preferredSize.height = 20;
    var OtherTitle = secondRow.add("staticText", undefined, "Other: ")
    var underscoreText = secondRow.add("button", undefined, " _ ");
            underscoreText.preferredSize.width = 30;
            underscoreText.preferredSize.height = 20;
    var hyphenButton = secondRow.add("button", undefined, " - ");
            hyphenButton.preferredSize.width = 30;
            hyphenButton.preferredSize.height = 20;
    var spaceButton = secondRow.add("button", undefined, "Space");
            spaceButton.preferredSize.width = 45;
            spaceButton.preferredSize.height = 20;
    var freeformText = thirdRow.add("edittext", undefined, "Custom Text Field");
            freeformText.characters = 12;
            freeformText.preferredSize.height = 20;
    var buttonSubmitText = thirdRow.add("button", undefined, "Add Text");
            buttonSubmitText.preferredSize.height = 20;

        //Erase the freeform text when the user clicks on it
        freeformText.onActivate = function(){
            freeformText.text = "";
        }
        //Submit function for freeform text
        buttonSubmitText.onClick = function(){
            if(freeformText.text === "Custom Text Field"){
                alert("Please add text into the custom text field before clicking 'Add Text'");
            } else {
                fileName = fileName + freeformText.text;
                exportName.text = fileName + ".png";
                exportName.parent.layout.layout(true);
            }
            freeformText.text = "Custom Text Field";
        }

    // FILE NAMING PANEL
    var fileName = "";
        //Panel Setup
    var previewPanel = mainPanel.add("panel", undefined, "Preview File Name");
    var fileNameGroup = previewPanel.add("group", undefined, {orientation: "row"});
        //Export Variables
    var exportName = fileNameGroup.add("statictext", undefined, "preview.png", {multiline: true, scrollable: true});
    exportName.characters = 18;
    var clearName = fileNameGroup.add("button", undefined, "Clear");
    clearName.preferredSize.height = 20;
    clearName.preferredSize.width = 40;

    //hyphen button function
    hyphenButton.onClick = function(){
        fileName = fileName + "-"
        exportName.text = fileName + ".png";
        exportName.parent.layout.layout(true);
    }
    //underscore button function
    underscoreText.onClick = function(){
        fileName = fileName + "_";
        exportName.text = fileName + ".png";
        exportName.parent.layout.layout(true);
    }
    //space button function
    spaceButton.onClick = function(){
        fileName = fileName + " ";
        exportName.text = fileName + ".png";
        exportName.parent.layout.layout(true);
    }
    //clear button function
    clearName.onClick = function() {
        fileName = ""; 
        exportName.text = "preview.png"; 
    };
    //name dropdown button functions
    addToName.onClick = function() {
        if (nameDrop.selection) {
            switch (nameDrop.selection.index) {
                case 0:
                    fileName = fileName + getProjectName(); 
                    break;
                case 1:
                    fileName = fileName + compName; 
                    break;
                case 2:
                    fileName = fileName + formatFrame; 
                    break;
                case 3:
                    if(String(day).length === 2){
                    fileName = fileName + day;
                    } else {
                        fileName = fileName + "0" + day;
                    }
                    break;
                case 4:
                    fileName = fileName + shortYear;
                    break;
                case 5: 
                    fileName = fileName + year;
                    break;
                case 6:
                    if(String(month).length === 2){
                        fileName = fileName + month;
                        } else {
                            fileName = fileName + "0" + month;
                        }
                    break;
                case 7:
                    fileName = fileName + abbMonth;
                    break;
                case 8:
                    fileName = fileName + monthName;
                    break;
                case 9:
                    if(String(hours).length === 2){
                        fileName = fileName + hours;
                        } else {
                            fileName = fileName + "0" + hours;
                        }
                    break;
                case 10:
                    if(String(minutes).length === 2){
                        fileName = fileName + minutes;
                        } else {
                            fileName = fileName + "0" + minutes;
                        }
                    break;
                case 11:
                    if(String(seconds).length === 2){
                        fileName = fileName + seconds;
                        } else {
                            fileName = fileName + "0" + seconds;
                        }
                    break;
                default:
                    alert("Unexpected dropdown selection.");
                    return;
            }
            exportName.text = fileName + ".png";
            exportName.parent.layout.layout(true);
        } else {
            alert("no selection made in dropdown list.")
        }
    };

        // Folder path browse button
        var defaultPath = getCurrentProjectFolder();
        var folderGroup = mainPanel.add("group", undefined);
        var SaveText = folderGroup.add("statictext", undefined, "Save Path:");
        var folderPathText = folderGroup.add("edittext", undefined, defaultPath, {readonly: false});
            folderPathText.characters = 20;
        var browseButton = folderGroup.add("button", undefined, "Browse");
            browseButton.preferredSize.height = 20;
        var destFolder = null;
        // Browse button function
        browseButton.onClick = function() {
            var projectFolder = defaultPath;
            var folder = Folder.selectDialog("Select a folder");
            if (folder) {
                folderPathText.text = folder.fsName;
                destFolder = folder.fsName;
            }
        };


    // Export Button Panel Set Up
    var exportGroup = mainPanel.add("group", undefined);
    var exportButton = exportGroup.add("button", undefined, "Save As PNG");
    //Export Button function
    exportButton.onClick = function() {
        try {
            var exportInfo = exportName.text;
            var location = destFolder + slash + exportInfo;
            active.saveFrameToPng(1, File(location));
            alert("Export successful: " + location);
        } catch (e) {
            alert("An error occurred during export: " + e.message);
        }
    };
    
    mainPanel.layout.layout(true);
    mainPanel.layout.resize();
    return mainPanel;
}

var panel = scriptUI(this);

if (panel instanceof Window) {
    panel.center();
    panel.show();
}
    }

//Script Created by Blake Fealy