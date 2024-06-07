const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;
const host = '127.0.0.1'; // Sử dụng địa chỉ IP loopback (localhost)

let foodData = [];
let orderHistory = [];

// Hàm đọc tệp CSV và trả về Promise
const loadCSV = (filePath, dataArray) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                try {
                    if (filePath.includes('food_items') || filePath.includes('selected_columns_new')) {
                        row.ingredients = row.ingredients.split(', ');
                    } else if (filePath.includes('order_history')) {
                        row.order_count = parseInt(row.order_count);
                    }
                    dataArray.push(row);
                } catch (error) {
                    console.error('Error processing row:', row, error);
                }
            })
            .on('end', () => {
                console.log(`Data loaded from ${filePath}`);
                resolve();
            })
            .on('error', (error) => {
                console.error(`Error reading ${filePath}:`, error);
                reject(error);
            });
    });
};

// Đọc dữ liệu từ các tệp CSV
Promise.all([
    loadCSV('D:/food-recommendation-api/Dataset/Preprocessing Data/food_items_processed.csv', foodData),
    loadCSV('D:/food-recommendation-api/Dataset/Preprocessing Data/order_history.csv', orderHistory)
]).then(() => {
    console.log('All data loaded, starting the server...');

    // Route gốc để hiển thị thông báo đơn giản
    app.get('/', (req, res) => {
        res.send('Welcome to the Food Recommendation API');
    });

    // Route để gợi ý món ăn dựa trên tên món và lịch sử đặt hàng của người dùng
    app.get('/recommendations/:userId', (req, res) => {
        const userId = parseInt(req.params.userId);
        const userOrders = orderHistory.filter(order => order.user_id == userId);

        if (userOrders.length === 0) {
            return res.status(404).send('User not found or no order history');
        }

        const recommendedFoods = getRecommendations(userOrders);
        res.json(recommendedFoods);
    });

    // Hàm gợi ý các món ăn tương tự dựa trên lịch sử đặt hàng
    function getRecommendations(userOrders) {
        const foodScores = {};

        userOrders.forEach(order => {
            const foodItem = foodData.find(item => item.food_id == order.food_id);
            if (foodItem) {
                const ingredients = foodItem.ingredients;
                foodData.forEach(item => {
                    if (item.food_id != order.food_id) {
                        const itemIngredients = item.ingredients;
                        const commonIngredients = ingredients.filter(ingredient => itemIngredients.includes(ingredient));
                        const similarityScore = commonIngredients.length;

                        if (!foodScores[item.food_id]) {
                            foodScores[item.food_id] = 0;
                        }
                        foodScores[item.food_id] += similarityScore * order.order_count;
                    }
                });
            }
        });

        const sortedFoodIds = Object.keys(foodScores).sort((a, b) => foodScores[b] - foodScores[a]);
        const recommendations = sortedFoodIds.slice(0, 10).map(food_id => {
            return foodData.find(item => item.food_id == food_id);
        });

        return recommendations;
    }

    app.listen(port, host, () => {
        console.log(`Food recommendation API is running at http://${host}:${port}`);
    });
}).catch((error) => {
    console.error('Error loading data:', error);
});
