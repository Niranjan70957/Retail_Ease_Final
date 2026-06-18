package com.project.ecom.controller;


import com.project.ecom.model.Product;
import com.project.ecom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ProductController
{

    @Autowired
    private ProductService service;

    @GetMapping("/products")
    public ResponseEntity <List<Product>> getAllProducts()
    {
        return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
    }



    @GetMapping("/product/{id}")
    public ResponseEntity <Product> getProductById(@PathVariable int id)
    {
        Product product = service.getProductById(id);
        if(product!=null)
        {
            return new ResponseEntity<>(product,HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product,
                                        @RequestPart MultipartFile imageFile)
    {
        try {
            Product product1 =service.addProduct(product,imageFile);
            return new ResponseEntity<>(product1,HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProduct(@PathVariable int productId)
    {
        Product product =service.getProductById(productId);
        byte[] imageFile = product.getImageData();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);

    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product ,
                                                @RequestPart MultipartFile imageFile)
    {
        Product product2=null;
        try {
            product2=service.updateProduct(id,product,imageFile);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update",HttpStatus.BAD_REQUEST);
        }

        if(product2!=null)
        {
            return new ResponseEntity<>("Updated",HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Failed to update",HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id)
    {
        Product product = service.getProductById(id);
            if(product!=null)
            {
                service.deleteProduct(id);
                return new ResponseEntity<>("Deleted",HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>("Not Found",HttpStatus.NOT_FOUND);
            }
    }


    @GetMapping("/product/search")
    public ResponseEntity<List<Product>> searchProducts(String key)
    {
        List<Product> product = service.searchProducts(key);
        return new ResponseEntity<>(product,HttpStatus.OK);
    }


}
