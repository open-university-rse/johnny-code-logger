/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var Client = require('node-rest-client').Client;

var client = new Client();
const USER_ID = 3;
const BASE_REST_URL = 'http://0.0.0.0:8000';
const CLIPBOARD_URL = BASE_REST_URL + "/api/clipboard/";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	var disposableArray = [];

	disposableArray.push(vscode.commands.registerCommand('johnny-code-logger.helloWorld', () => {
	
		vscode.window.showInformationMessage('Hello World from johnny-code-logger!');
	}));

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
			data: { user_id: USER_ID, time: date, text:clipboardContent },
			headers: { "Content-Type": "application/json" }
		};

		client.post(CLIPBOARD_URL, args, function (data:any, response:any) {
			// parsed response body as js object
			console.log(data);
			// raw response
			console.log(response);
		});
	
		//dispose of the overridden editor.action.clipboardCopyAction- back to default copy behavior
		clipboardPasteDisposable.dispose();
	
		//execute the default editor.action.clipboardCopyAction to copy
		vscode.commands.executeCommand("editor.action.clipboardPasteAction").then(function(){
	
			// console.log("After Copy");
	
			//add the overridden editor.action.clipboardCopyAction back
			clipboardPasteDisposable = vscode.commands.registerTextEditorCommand('editor.action.clipboardPasteAction', overriddenClipboardPasteAction);
			disposableArray.push(clipboardPasteDisposable);
		}); 
	}

	context.subscriptions.concat(disposableArray);
}

// this method is called when your extension is deactivated
export function deactivate() {}
