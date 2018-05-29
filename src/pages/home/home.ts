import { Component } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { ProductProvider } from "../../providers/product/product";
import { ProductDetailPage } from '../product-detail/product-detail';
import { FilterModalPage } from '../filter-modal/filter-modal';


import { NavController , ModalController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public allProducts =[];
  private femaleSelected = true;
  private maleSelected = true;

  constructor( private modalcontroller:ModalController, private productProvider:ProductProvider ,private http:Http, public navCtrl: NavController) {

  }

  openFilterModule(){
    let filterStateFromMainPage ={
      femaleSelected : this.femaleSelected,
      maleSelected : this.maleSelected,
    }

    let openFilterModule = this.modalcontroller.create(FilterModalPage ,filterStateFromMainPage );

    openFilterModule.onDidDismiss((filterState)=>{
      this.femaleSelected = filterState.femaleSelected;
      this.maleSelected = filterState.maleSelected;
      this.productProvider.getProducts()
      .subscribe((allProducts)=>{
        let products = allProducts;
        if(filterState.maleSelected && filterState.femaleSelected ){
          this.allProducts = products;
          return;
        }else if (!filterState.maleSelected && !filterState.femaleSelected){
          this.allProducts = [];
          return;
        }else if (!filterState.maleSelected && filterState.femaleSelected){
          this.allProducts = products.filter((product)=> {
            return product.gender !== "male";
          });
        }else{
          this.allProducts = products.filter((product)=> {
            return product.gender !== "female";
          });
        };
      });
    });

    openFilterModule.present();
  }

  ionViewDidLoad(){
    this.productProvider.getProducts()
    .subscribe((Response) => {
      this.allProducts = Response;
    });
  }

  goToProductDetailPage(product){
    this.navCtrl.push(ProductDetailPage, {
      productDetails: product
    });
  }
}
