import { Foto } from '../models/foto.interface';
import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import {Filesystem, Directory} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
@Injectable({
  providedIn: 'root'
})
export class FotoService {
  //Arrelgo almacenar fotos
  public fotos: Foto[] = [];
  private PHOTO_STORAGE: string = "fotos";

  constructor() { }
 
  public async agregarImagen()
  {
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })

    /*this.fotos.unshift({
    filepath: "foto_",
    webviewPath: fotoCapturada.webPath
    })*/

    const saveImageFile = await this.savePinture(fotoCapturada);
    if (saveImageFile.webviewPath) {
      this.fotos.unshift(saveImageFile);
      Storage.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.fotos)
      });
    } else {
      console.error("webviewPath es undefined");
    }
    
  }

  public  async savePinture(cameraPhoto: CameraPhoto)
  {
    //convertir foto a formato base64
    const base64Data = await this.readAsBase64(cameraPhoto)
    //escrbir la foto en el directorio
    const fileName = new Date().getTime + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    return{
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    }
  }


  public async readAsBase64(CameraPhoto: CameraPhoto){
    //convertir de blog a base64
    const response = await fetch(CameraPhoto.webPath!)
    const blob = await response.blob()

    return await this.convertBlobToBase64(blob) as string
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject)=>{
    const reader = new FileReader
    reader.onerror = reject
    reader.onload = () =>{
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })

  public async loadSaved()
  {
    //recuperar fotos cache
    const listaFotos = await Storage.get({ key: this.PHOTO_STORAGE });
    const fotosValue = listaFotos.value ? JSON.parse(listaFotos.value) : [];
    this.fotos = fotosValue || [];

    //desplegar fotos a base64
    for(let foto of this.fotos){
      //leer cada foto alamacenada en el sistema de archivos
      const readFile = await Filesystem.readFile({
        path: foto.filepath,
        directory: Directory.Data
      })

      //solo paea plataforma web cargar abse 64
      foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`
    }
  }
}
