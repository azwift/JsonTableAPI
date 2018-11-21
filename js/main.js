"use strict";
(function(){
	class Table{
		constructor(){
			this.table = document.querySelector("#table table tbody");
		  this.exportBtn = document.querySelector("#toolbar .export a");
		  this.copyBtn = document.querySelector("#toolbar .copy");
		  this.copyArea = document.querySelector("#toolbar .copy > input");
		  this.exportName = document.querySelector("#toolbar input.file");
		  this.exportBtn.download = "default.txt";
		  this.exportBtn.addEventListener("click", this.exportTxt.bind(this));
		  this.copyBtn.addEventListener("click", this.copyTxt.bind(this));
		  
		  this.registerEvents();
		}
		registerEvents(){
		  //edit on hover for file name
			this.exportBtn.addEventListener("mouseover",((e)=>{this.exportName.focus();}));
		}
		 createHeaderRows(headers){
			let temp = "";
			for(let i = 0; i < headers.length; i++){
				temp += Utility.wrap("th",headers[i]);
			}
			this.table.innerHTML = Utility.wrap("tr", temp);
		}
		exportTxt(event){
			const name = this.exportName.value;
			if(name)
				this.exportBtn.download = `${name}.txt`;
			else{
				this.exportBtn.download = `filename.txt`;
			}
			this.exportBtn.href = `data:application/vnd.ms-excel,${this.table.parentElement.outerHTML}`;
		}
		copyTxt(event){
			this.copyArea.setAttribute("value", this.table.parentElement.outerHTML);
			this.copyArea.select();
	    document.execCommand("copy");
	    this.copyArea.setAttribute("value","");
		}
		addToTable(html){
			this.table.innerHTML += html;
		}
		createTable(headers,response){
			this.createHeaderRows(headers);

			let tableHTML = "";
			for(let i = 0; i < response.length; i++){
				let jsonRows = "";
				for(let j = 0; j < headers.length; j++){
					const data = response[i][headers[j]];
					const value = typeof(data) === "object" ? JSON.stringify(data) : data;
					jsonRows += Utility.wrap("td", value);
				}
				tableHTML += Utility.wrap("tr", jsonRows);
			}

			this.addToTable(tableHTML);
		}
	}
	class Utility{
		static wrap(tag,content){
				return `<${tag}>${content}</${tag}>`;
		}
	}
	window.addEventListener("load", init);

	function init(){
		const config = {jsonPath : "https://jsonplaceholder.typicode.com/users",table: null};
		config.table = new Table();
		if(!config.table.table){
			console.error("Table not found");
			return;
		}

		$.getJSON({url: config.jsonPath}).done((response) =>{
			console.log(response);
			if(!response.length){
				console.log("response is empty");
				return;
			}
			const headers = Object.keys(response[0]);
			config.table.createTable(headers,response);		
			console.log("table created")	
		});	
	}
	
}())