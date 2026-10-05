package com.wipro.canteen.service;

import com.wipro.canteen.entity.FoodItem;
import com.wipro.canteen.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;

    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    public FoodItem createFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public Optional<FoodItem> getFoodItemById(Long id) {
        return foodItemRepository.findById(id);
    }

    public FoodItem updateFoodItem(Long id, FoodItem updatedFood) {

        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Food item not found"));

        foodItem.setFoodName(updatedFood.getFoodName());
        foodItem.setPrice(updatedFood.getPrice());
        foodItem.setAvailableQuantity(
                updatedFood.getAvailableQuantity()
        );
        foodItem.setAvailable(
                updatedFood.getAvailable()
        );

        return foodItemRepository.save(foodItem);
    }

    public void deleteFoodItem(Long id) {

        if (!foodItemRepository.existsById(id)) {
            throw new RuntimeException("Food item not found");
        }

        foodItemRepository.deleteById(id);
    }

    public List<FoodItem> getAboveAverageFoodItems() {
        return foodItemRepository.findFoodItemsOrderedAboveAverage();
    }
}