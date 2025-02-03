import { defineType } from "sanity";

export const product = defineType({
    name: 'products',
    title: 'Products',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image', // This uses Sanity's image type
            options: {
                hotspot: true, // Enables cropping and hotspot selection
            },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'T-Shirt', value: 'tshirt' },
                    { title: 'Short', value: 'short' },
                    { title: 'Jeans', value: 'jeans' },
                    { title: 'Hoodie', value: 'hoodie' }, // Corrected spelling
                    { title: 'Shirt', value: 'shirt' },
                ],
            },
        },
        {
            name: 'discountPercent',
            title: 'Discount Percent',
            type: 'number',
        },
        {
            name: 'isNew',
            title: 'Is New', // Changed from `new` to `isNew`
            type: 'boolean',
        },
        {
            name: 'colors',
            title: 'Colors',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'sizes',
            title: 'Sizes',
            type: 'array',
            of: [{ type: 'string' }],
        },
    ],
});
