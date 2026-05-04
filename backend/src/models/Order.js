const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    paymentId: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    items: {
      type: DataTypes.JSON, // Stores [{productId, quantity, price}]
      allowNull: false,
    }
  });

  return Order;
};
