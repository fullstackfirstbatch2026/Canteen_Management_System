package com.wipro.canteen.controller;

import com.wipro.canteen.dto.OrderRequest;
import com.wipro.canteen.entity.Order;
import com.wipro.canteen.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequest request) {

        return ResponseEntity.ok(
                orderService.createOrder(request)
        );
    }

    // Stored Procedure endpoint
    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(
            @RequestBody OrderRequest request) {

        orderService.placeOrder(
                request.getStudentId(),
                request.getFoodId(),
                request.getQuantity()
        );

        return ResponseEntity.ok(
                "Order placed successfully using stored procedure"
        );
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    @GetMapping("/with-details")
    public ResponseEntity<List<Order>> getOrdersWithDetails() {

        return ResponseEntity.ok(
                orderService.getOrdersWithDetails()
        );
    }

    @GetMapping("/calculate-amount")
    public ResponseEntity<BigDecimal> calculateOrderAmount(
            @RequestParam Long foodId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                orderService.calculateOrderAmount(
                        foodId,
                        quantity
                )
        );
    }
}