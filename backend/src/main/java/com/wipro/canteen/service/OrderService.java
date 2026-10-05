package com.wipro.canteen.service;

import com.wipro.canteen.dto.OrderRequest;
import com.wipro.canteen.entity.FoodItem;
import com.wipro.canteen.entity.Order;
import com.wipro.canteen.entity.OrderItem;
import com.wipro.canteen.entity.Student;
import com.wipro.canteen.repository.FoodItemRepository;
import com.wipro.canteen.repository.OrderItemRepository;
import com.wipro.canteen.repository.OrderRepository;
import com.wipro.canteen.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final StudentRepository studentRepository;
    private final FoodItemRepository foodItemRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            StudentRepository studentRepository,
            FoodItemRepository foodItemRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.studentRepository = studentRepository;
        this.foodItemRepository = foodItemRepository;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        FoodItem foodItem = foodItemRepository.findById(request.getFoodId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));

        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        if (foodItem.getAvailableQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient food availability");
        }

        BigDecimal amount = foodItem.getPrice()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        Order order = new Order();

        order.setStudent(student);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(amount);

        Order savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();

        orderItem.setOrder(savedOrder);
        orderItem.setFoodItem(foodItem);
        orderItem.setQuantity(request.getQuantity());
        orderItem.setPrice(foodItem.getPrice());

        orderItemRepository.save(orderItem);

        foodItem.setAvailableQuantity(
                foodItem.getAvailableQuantity() - request.getQuantity()
        );

        foodItemRepository.save(foodItem);

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersWithDetails() {
        return orderRepository.findOrdersWithStudentAndFood();
    }

    public void placeOrder(Long studentId, Long foodId, Integer quantity) {
        orderRepository.placeOrder(studentId, foodId, quantity);
    }

    public BigDecimal calculateOrderAmount(
            Long foodId,
            Integer quantity) {

        return orderRepository.calculateOrderAmount(
                foodId,
                quantity
        );
    }

    /**
     * Confirm an order by setting its status to CONFIRMED.
     * Only orders with status PLACED can be confirmed.
     */
    @Transactional
    public Order confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!"PLACED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only PLACED orders can be confirmed");
        }
        order.setStatus("CONFIRMED");
        return orderRepository.save(order);
    }

    /**
     * Edit an existing PLACED order. Allows changing food item and quantity.
     * Adjusts food availability accordingly and recalculates total amount.
     */
    @Transactional
    public Order editOrder(Long orderId, OrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!"PLACED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only PLACED orders can be edited");
        }
        // Assuming each order has a single OrderItem for simplicity
        OrderItem orderItem = order.getOrderItems().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Order items not found"));
        // Restore stock of previous food item
        FoodItem oldFood = orderItem.getFoodItem();
        int oldQty = orderItem.getQuantity();
        oldFood.setAvailableQuantity(oldFood.getAvailableQuantity() + oldQty);
        foodItemRepository.save(oldFood);
        // Fetch new food item
        FoodItem newFood = foodItemRepository.findById(request.getFoodId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        if (newFood.getAvailableQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient food availability");
        }
        // Deduct new quantity
        newFood.setAvailableQuantity(newFood.getAvailableQuantity() - request.getQuantity());
        foodItemRepository.save(newFood);
        // Update order item
        orderItem.setFoodItem(newFood);
        orderItem.setQuantity(request.getQuantity());
        orderItem.setPrice(newFood.getPrice());
        orderItemRepository.save(orderItem);
        // Recalculate total amount
        BigDecimal newAmount = newFood.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        order.setTotalAmount(newAmount);
        return orderRepository.save(order);
    }
}