import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-value-counter",
	templateUrl: "./value-counter.component.html",
	styleUrls: ["./value-counter.component.scss"]
})
export class ValueCounterComponent implements OnInit {
	@Input()subLabel;

	@Input()label;

	@Output()increment = new EventEmitter();

	@Output()decrement = new EventEmitter();

	private _value: number;

	constructor() {}

	ngOnInit() {}

	@Input()
	set value(value: number) {
		this._value = value;
	}
	get value(): number {
		return this._value;
	}

	incrementClicked() {
		this.increment.emit();
	}

	decrementClicked() {
		this.decrement.emit();
	}
}
