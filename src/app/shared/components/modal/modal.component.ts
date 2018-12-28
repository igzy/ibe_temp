import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('content') private content;
  @Input() private translations;
  constructor(private modalService: NgbModal, 
    private router: Router,
    private authorizationService: AuthorizationService) {}

  ngOnInit() {  
    setTimeout(() => {
      this.modalService.open(this.content, {centered: true});
      this.reloadApp();
    },200)
  }

  reloadApp() {
    setTimeout(() => {
      this.authorizationService.setAuthorizationStatus(true);
      window.location.reload();
    }, 3000);
  }

}
