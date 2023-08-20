import { App, Plugin } from 'obsidian';

async function wait(timeInMs: number) {
  return new Promise((r) => setTimeout(r, timeInMs));
}

export default class TabAutocomplete extends Plugin {
	promptIsOpen: false;

	async setPromptValue(value) {
		const promptInput = document.getElementsByClassName("prompt-input")[0];
		promptInput.value = value;
					
		const event = new Event("input", {
			'bubbles': true,
			'cancelable': true,
			'target': promptInput,
			'simulated': true
		});
		promptInput.dispatchEvent(event);	
	}

	async getSelectedSuggestion() {
		const selectedSuggestions = document.getElementsByClassName("suggestion-item mod-complex is-selected");
		if (selectedSuggestions.length === 0) {
			return;
		}

		const innerHTML = selectedSuggestions[0].children[0].children[0].innerHTML
		return innerHTML.replace('<span class="suggestion-highlight">', '').replace('</span>', '');
	}

	async onTabPressed() {
		if (!this.promptIsOpen) {
			return;
		}

		const selectedValue = await this.getSelectedSuggestion();
		await this.setPromptValue(selectedValue);
	}

	async onDomNodeInserted(node) {
		if (!node?.target?.className?.includes) {
			return;
		}

		if (!node.target.className.includes("modal-container")) {
			return;
		}
			
		this.promptIsOpen = true;
	}

	async onDomNodeRemoved(node) {
		if (!node?.target?.className?.includes) {
			return;
		}

		if (!node.target.className.includes("modal-container")) {
			return;
		}
			
		this.promptIsOpen = false;
	}

	async onKeyUp(event) {
		if (event.key === "Tab") {
			await this.onTabPressed();
		}
	}

	evObjDNI = undefined;
	evObjDNR = undefined;
	evObjK = undefined;
	async onload() {
		this.evObjDNI = (node) => this.onDomNodeInserted(node);
		this.evObjDNR = (node) => this.onDomNodeRemoved(node);
		this.evObjK = (event) => this.onKeyUp(event);

		document.addEventListener("DOMNodeInserted", this.evObjDNI, false);
		document.addEventListener("DOMNodeRemoved", this.evObjDNR, false);
		document.addEventListener("keyup", this.evObjK);
	}

	onunload() {
		document.removeEventListener("DOMNodeInserted", this.evObjDNI);
		document.removeEventListener("DOMNodeRemoved", this.evObjDNR);
		document.removeEventListener("keyup", this.evObjK);
	}
}
