/**
 * Migration: Add artisanId, isAvailable fields to Products table
 * This migration adds the necessary fields for artisan product management
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add artisanId column
    await queryInterface.addColumn('Products', 'artisanId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // Add isAvailable column
    await queryInterface.addColumn('Products', 'isAvailable', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });

    // Create index on artisanId
    await queryInterface.addIndex('Products', ['artisanId'], {
      name: 'products_artisanId_idx',
    });

    // Create index on isAvailable
    await queryInterface.addIndex('Products', ['isAvailable'], {
      name: 'products_isAvailable_idx',
    });

    // Update existing products to set isAvailable based on stock
    await queryInterface.sequelize.query(`
      UPDATE Products 
      SET isAvailable = CASE 
        WHEN stock > 0 THEN true 
        ELSE false 
      END
      WHERE isAvailable IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('Products', 'products_isAvailable_idx');
    await queryInterface.removeIndex('Products', 'products_artisanId_idx');

    // Remove columns
    await queryInterface.removeColumn('Products', 'isAvailable');
    await queryInterface.removeColumn('Products', 'artisanId');
  },
};

