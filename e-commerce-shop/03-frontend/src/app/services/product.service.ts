import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private http: HttpClient) { }

  getProductListPaginate(page: number,
    pageSize: number,
    categoryId: number): Observable<GetResponseProducts> {

    // need to build URL for based on category id, page and page size
    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.http.get<GetResponseProducts>(url);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.http.get<Product>(productUrl);
  }

  // searchProducts(keyword: string): Observable<Product[]> {
  //   const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
  //   return this.getProducts(searchUrl)
  // }

  searchProductsPaginate(page: number,
                        pageSize: number,
                        keyword: string): Observable<GetResponseProducts> {

    // need to build URL for based on category id, page and page size
    const url = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;
    return this.http.get<GetResponseProducts>(url);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.http.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}