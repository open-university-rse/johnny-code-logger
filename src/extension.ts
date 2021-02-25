/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getTimeSinceLastUpload } from './timer';
var Client = require('node-rest-client').Client;
var client = new Client();
// var browserHistory = require("./node-browser-history/index");
const USER_ID = 3;
// const BASE_REST_URL = 'http://0.0.0.0:8000';
const BASE_REST_URL = 'http://192.168.1.134:8000';
const CLIPBOARD_URL = BASE_REST_URL + "/api/clipboard/";
const FILES_URL = BASE_REST_URL + "/api/file/";
const BROWSER_HISTORY_URL = BASE_REST_URL + "/api/website/";
var time = require("./timer");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('time.sessionStartTime', time.sessionStartTime);
	
	var disposableArray = [];

	disposableArray.push(vscode.commands.registerCommand('johnny-code-logger.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from johnny-code-logger!');
	}));

	// Clipboard - send contents of clipboard when a paste occurs
	var clipboardPasteDisposable = vscode.commands.registerTextEditorCommand('editor.action.clipboardPasteAction', overriddenClipboardPasteAction);
	disposableArray.push(clipboardPasteDisposable);
	async function overriddenClipboardPasteAction() {

		//debug
		var clipboardContent = await vscode.env.clipboard.readText();
		// console.log(clipboardContent);

		// send paste to server
		// set content-type header and data as json in args parameter
		var date = new Date();
		var args = {
			data: { user_id: USER_ID, time: date, text: clipboardContent },
			headers: { "Content-Type": "application/json" }
		};

		client.post(CLIPBOARD_URL, args, function (data: any, response: any) {
			// parsed response body as js object
			console.log(data);
			// raw response
			console.log(response);
		});

		//dispose of the overridden editor.action.clipboardCopyAction- back to default copy behavior
		clipboardPasteDisposable.dispose();

		//execute the default editor.action.clipboardCopyAction to copy
		vscode.commands.executeCommand("editor.action.clipboardPasteAction").then(function () {

			//add the overridden editor.action.clipboardCopyAction back
			clipboardPasteDisposable = vscode.commands.registerTextEditorCommand('editor.action.clipboardPasteAction', overriddenClipboardPasteAction);
			disposableArray.push(clipboardPasteDisposable);
		});
	}

	disposableArray.push(vscode.workspace.onDidSaveTextDocument(async (e) => {

		const editor = vscode.window.activeTextEditor;
		var docType: string = "";
		if (editor) {
			docType = editor.document.languageId;
		}
		if (docType === "python") {
			var text: string = "";

			if (editor) {
				var fileText = editor.document.getText();
				var date = new Date();
				var args = {
					data: { user_id: USER_ID, time: date, text: fileText, path: "pathhhh" },
					headers: { "Content-Type": "application/json" }
				};

				client.post(FILES_URL, args, function (data: any, response: any) {
					// parsed response body as js object
					// console.log(data);
					// raw response
					// console.log(response);
				});
			}
		}
		updateBrowserHistory();
	})
	// send new websites
	// {
	// 	"user_id": 3,
	// 	"time": "2012-09-04 06:00:01.000000-08:00",
	// 	"url": "https://www.google.com/search?q=pytest+not+finding+tests"
	
	// }

	
	);

	context.subscriptions.concat(disposableArray);
}
function updateBrowserHistory() {
 	var lastUpload = time.getTimeSinceLastUpload();
	var diff = time.getTimeSinceLastUpload();
	console.log('diff', diff);
}

// this method is called when your extension is deactivated
export function deactivate() { 
	
}
