
import {
    Component,
	Input,
	Output,
	AfterContentInit,
	ElementRef,
	EventEmitter,
	ViewChild,
	OnChanges
} from '@angular/core';


@Component({
	selector: 'showcase',
	templateUrl: './flexible-showcase.component.html',
	styleUrls: ['./flexible-showcase.component.scss']
})
export class FlexibleShowcaseComponent implements AfterContentInit, OnChanges  {
	private translatedPosition = 0;
	selectedIndex = 0;
	selectedItem: any;
	hoverItem: any;
	paginate = false;

	@ViewChild("largeImage")
	private largeImage: ElementRef;

	@ViewChild("slider")
	private slider: ElementRef;

    @Input("position")
    public position: string; // top, left, bottom, right

	@Input("width")
    public width: number;

	@Input("height")
    public height: number;

	@Input("productId")
    public productId: string;
	
    @Input("zoomOnHover")
    public zoomOnHover = false

    @Input("peekOnHover")
    public peekOnHover = false

    @Input("enableEventTracking")
    public enableEventTracking = false

    @Input("thumbnails")
    public thumbnails: any[];

    @Input("message")
    public message = "click to select ";

	@Output('onEventTracking')
	private onEventTracking = new EventEmitter();

    constructor() {}

	ngAfterContentInit() {
		this.selectedIndex = 0;
		this.thumbnails[0].selected = true;
		this.selectedItem = this.thumbnails[0];
		this.paginate = (this.thumbnails.length * 60) > this.width;
	}
	ngOnChanges(changes) {
		if (changes.position && this.slider) {
			this.translatedPosition = 0;
			this.slider.nativeElement.style.transform = "translate(0px,0px)";
		}
	}
	hoverOver(event, item) {
		if (this.zoomOnHover && event.target.nodeName === 'IMG') {
			this.fireTrackingEvent(item.title, item.thumbnailId, "zoomed");
		}
	}
	hoverOut(event) {
		if (this.largeImage) {
			this.largeImage.nativeElement.style.opacity = 0;
			this.largeImage.nativeElement.style.top = "-10000px";
			this.largeImage.nativeElement.style.left = "-10000px";
		}
	}
	hoverViewPort(event) {
		if (this.zoomOnHover && event.target.nodeName === 'IMG') {
			this.largeImage.nativeElement.style.opacity = 1;
			this.largeImage.nativeElement.style.top = -event.layerY + "px";
			this.largeImage.nativeElement.style.left = -event.layerX + "px";
		}
	}
	shiftDisplay(position, toEnd) {		
		if (position === "top" || position === "bottom") {
			this.translatedPosition += (toEnd ? -60 : 60);
			this.translatedPosition = this.translatedPosition > 0 ? 0 : this.translatedPosition;
			this.slider.nativeElement.style.transform = "translateX(" + this.translatedPosition + "px)";
		} else {
			this.translatedPosition += (toEnd ? -60 : 60);
			this.translatedPosition = this.translatedPosition > 0 ? 0 : this.translatedPosition;
			this.slider.nativeElement.style.transform = "translateY(" + this.translatedPosition + "px)";
		}

		if (this.enableEventTracking) {
			this.onEventTracking.emit({
				productId: this.productId,
				action: "thombnail shift",
				time: new Date()
			});
		}
	}
	keyup(event) {
        const code = event.which;
		
		if (code === 13) {
			event.target.click();
		}
	}
	videoPlayed(item, trackingTime) {
		this.fireTrackingEvent(
			item.title,
			item.thumbnailId,
			"play-video",
			trackingTime
		);
	}
	videoPaused(item, trackingTime) {
		this.fireTrackingEvent(
			item.title,
			item.thumbnailId,
			"pause-video",
			trackingTime
		);
	}
	videoEnded(item, trackingTime) {
		this.fireTrackingEvent(
			item.title,
			item.thumbnailId,
			"end-video",
			trackingTime
		);
	}
	hoverTab(i, onhover) {
		if (this.peekOnHover) {
			this.hoverItem = this.thumbnails[i];
		}
		this.fireTrackingEvent(
			this.thumbnails[i].title,
			this.thumbnails[i].thumbnailId,
			onhover ? "hover" : "focus"
		);
	}
	selectTab(i) {
		this.thumbnails.map((tab)=>{
			tab.selected = false;
		});
		this.selectedIndex = i;
		this.thumbnails[i].selected = true;
		this.selectedItem = this.thumbnails[i];
		this.fireTrackingEvent(
			this.thumbnails[i].title,
			this.thumbnails[i].thumbnailId,
			"select"
		);
	}
	private fireTrackingEvent(name, id, event, track?) {
		if (this.enableEventTracking) {
			if (track) {
				this.onEventTracking.emit({
					productId: this.productId,
					thumbnailId: id,
					action: event,
					title: name,
					currentTime: track,
					time: new Date()
				});
			} else {
				this.onEventTracking.emit({
					productId: this.productId,
					thumbnailId: id,
					action: event,
					title: name,
					time: new Date()
				});
			}
		}
	}
}
