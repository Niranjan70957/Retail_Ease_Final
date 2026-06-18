package com.project.ecom.repository;

import com.project.ecom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface Repo extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :key, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :key, '%'))")
    public List<Product> searchProducts(String key);
}

