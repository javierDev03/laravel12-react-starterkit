<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = Product::class;

    public function definition(): array
    {

        $categoryId = Category::inRandomOrder()->first()?->id;

        return [
            'category_id' => $categoryId ?? Category::factory(), // crea una categoría si no hay
            'name' => $this->faker->words(2, true),
            'sku' => $this->faker->unique()->bothify('PROD-####'),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'active' => $this->faker->boolean(90),
        ];
    }
}
