// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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

	// disposableArray.push(vscode.commands.registerCommand('clipboard.paste', () => {
	// 	console.log("clipboard.paste");
    //     vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    // }));

	// disposableArray.push(vscode.commands.registerCommand('clipboard.pasteFromClipboard', () => {
    //     console.log("clipboard.pasteFromClipboard");
    // }));

	context.subscriptions.concat(disposableArray);
}

// this method is called when your extension is deactivated
export function deactivate() {}
