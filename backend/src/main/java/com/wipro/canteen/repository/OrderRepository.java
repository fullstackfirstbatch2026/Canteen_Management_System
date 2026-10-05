package com.wipro.canteen.repository;

import com.wipro.canteen.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // 1. Display orders with student and food information using JOIN
    @Query("""
            SELECT DISTINCT o
            FROM Order o
            JOIN FETCH o.student s
            JOIN FETCH o.orderItems oi
            JOIN FETCH oi.foodItem f
            """)
    List<Order> findOrdersWithStudentAndFood();


    // 2. Call MySQL Stored Procedure: PlaceCanteenOrder
    @Modifying
    @Transactional
    @Query(
            value = "CALL PlaceCanteenOrder(:studentId, :foodId, :quantity)",
            nativeQuery = true
    )
    void placeOrder(
            @Param("studentId") Long studentId,
            @Param("foodId") Long foodId,
            @Param("quantity") Integer quantity
    );

    @Query(
            value = "SELECT CalculateOrderAmount(:foodId, :quantity)",
            nativeQuery = true
    )
    BigDecimal calculateOrderAmount(
            @Param("foodId") Long foodId,
            @Param("quantity") Integer quantity
    );
}