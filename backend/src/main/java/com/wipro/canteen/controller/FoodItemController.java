package com.wipro.canteen.controller;

import com.wipro.canteen.entity.FoodItem;
import com.wipro.canteen.service.FoodItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/food-items")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodItemController {

    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @PostMapping
    public ResponseEntity<FoodItem> createFoodItem(
            @RequestBody FoodItem foodItem) {

        return ResponseEntity.ok(
                foodItemService.createFoodItem(foodItem)
        );
    }

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {

        return ResponseEntity.ok(
                foodItemService.getAllFoodItems()
        );
    }

    @GetMapping("/reports/above-average")
    public ResponseEntity<List<FoodItem>> getAboveAverageFoodItems() {

        return ResponseEntity.ok(
                foodItemService.getAboveAverageFoodItems()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItemById(
            @PathVariable Long id) {

        return foodItemService.getFoodItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFoodItem(
            @PathVariable Long id,
            @RequestBody FoodItem foodItem) {

        return ResponseEntity.ok(
                foodItemService.updateFoodItem(id, foodItem)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodItem(
            @PathVariable Long id) {

        foodItemService.deleteFoodItem(id);

        return ResponseEntity.noContent().build();
    }
}