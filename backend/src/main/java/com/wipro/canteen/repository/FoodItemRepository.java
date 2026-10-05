package com.wipro.canteen.repository;

import com.wipro.canteen.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    @Query(value = """
            SELECT f.*
            FROM food_items f
            JOIN order_items oi
                ON f.food_id = oi.food_id
            GROUP BY f.food_id, f.food_name, f.price,
                     f.available_quantity, f.available
            HAVING SUM(oi.quantity) >
                   (
                       SELECT AVG(total_quantity)
                       FROM (
                           SELECT SUM(quantity) AS total_quantity
                           FROM order_items
                           GROUP BY food_id
                       ) AS totals
                   )
            """, nativeQuery = true)
    List<FoodItem> findFoodItemsOrderedAboveAverage();
}