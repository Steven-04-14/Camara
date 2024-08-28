import { FotoService } from './../services/foto.service';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import {Filesystem, Directory} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(public FotoService: FotoService) {}

  addPhotoToGallery(){
    this.FotoService.agregarImagen()
  }

  async ngOnInit(){
    await this.FotoService.loadSaved()
  }

}
