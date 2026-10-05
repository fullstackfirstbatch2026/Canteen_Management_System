package com.wipro.canteen.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponse {

    private Long orderId;
    private String studentName;
    private String foodName;
    private Integer quantity;
    private BigDecimal amount;
    private LocalDateTime orderDate;
    private String status;

    public OrderResponse() {
    }

    public OrderResponse(
            Long orderId,
            String studentName,
            String foodName,
            Integer quantity,
            BigDecimal amount,
            LocalDateTime orderDate,
            String status) {

        this.orderId = orderId;
        this.studentName = studentName;
        this.foodName = foodName;
        this.quantity = quantity;
        this.amount = amount;
        this.orderDate = orderDate;
        this.status = status;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getFoodName() {
        return foodName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public String getStatus() {
        return status;
    }
}