import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { HistorySearchListModel, HistorySearchModel } from "../../models/history-search-model";
import { CookieService } from "../../../core/services/cookie.service";
import { SearchHistoryService } from "../../../core/services/search-history.service";

@Component({
	selector: "app-search-history",
	templateUrl: "./search-history.component.html",
	styleUrls: ["./search-history.component.scss"]
})
export class SearchHistoryComponent implements OnInit {
	public isCollapsed = true;
	searchList: HistorySearchListModel = [];

	@Input() translations;
	@Output() hideEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() searchHistorySelected: EventEmitter<any> = new EventEmitter<any>();

	constructor(private cookieService: CookieService) {}

	ngOnInit() {
		let searchListCookie = this.cookieService.getCookie('searchList');
		if(searchListCookie != null ||  searchListCookie != undefined || searchListCookie != ""){
			this.searchList = JSON.parse(searchListCookie) as HistorySearchListModel;
		}
	}

	onClick(){
		this.hideEvent.emit(true);
	}

	onHistorySelected(history: HistorySearchListModel){
		this.searchHistorySelected.emit(history);
	}
}
