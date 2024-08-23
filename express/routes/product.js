import express from 'express'
// 連結db.js導入數據庫連接池
import db from '../configs/mysql.js'
// 創建一個新的路由
const router = express.Router()

// 取得所有商品
const getProducts = `SELECT 
    product.*,
    variet.name AS variet_name,
    category.id AS category_id,
    category.name AS category_name,
    country.id AS country_id,
    country.name AS country_name,
    origin.name AS origin_name
FROM 
    product
LEFT JOIN 
    variet ON product.variet_id = variet.id
LEFT JOIN 
    category ON variet.category_id = category.id
LEFT JOIN
	origin ON product.origin_id = origin.id
LEFT JOIN 
	country ON origin.country_id = country.id
LIMIT ? OFFSET ?`

// 取得指定id的商品
const getIdProduct = `SELECT 
    product.*,
    variet.name AS variet_name,
    category.id AS category_id,
    category.name AS category_name,
    country.id AS country_id,
    country.name AS country_name,
    origin.name AS origin_name
FROM 
    product
LEFT JOIN 
    variet ON product.variet_id = variet.id
LEFT JOIN 
    category ON variet.category_id = category.id
LEFT JOIN
	origin ON product.origin_id = origin.id
LEFT JOIN 
	country ON origin.country_id = country.id
WHERE product.id=?`

// 取得商品的總數
const getProductsTotal = `SELECT COUNT(*) as total FROM product`;

// 取得detail
const getProductsDetails = `SELECT * FROM product_detail WHERE product_id IN (?)`

// 取得images
const getImages = `SELECT * FROM images_product WHERE product_id IN (?)`

// 取得description
const getDescription = `SELECT * FROM description WHERE product_id IN (?)`

// 取得基礎分類
const getCategories = "SELECT * FROM category";

// 取得variet
const getVariet = `SELECT * FROM variet WHERE category_id IN (?)`

// 整理商品資訊的函式(多個)
const tidyProducts = async (products) => {
  try {
    // 獲取所有商品ID
    const productIds = products.map((p) => p.id)

    // 獲取所有商品詳細信息
    const [details] = await db.query(getProductsDetails, [productIds])
    const [images] = await db.query(getImages, [productIds])
    const [descriptions] = await db.query(getDescription, [productIds])

    //將詳細資料加到相對應的id
    return products.map((product) => ({
      ...product,
      images: images.filter((i) => i.product_id === product.id),
      descriptions: descriptions.filter((d) => d.product_id === product.id),
      details: details.filter((d) => d.product_id === product.id),
    }))
  } catch (error) {
    console.error('Error in tidyProducts:', error)
    throw error
  }
}

// 整理商品資訊的函式(單個)
const tidyProduct = async (product) => {
  try {
    const pid = product[0].id

    // 獲取所有商品詳細信息
    const [details] = await db.query(
      'SELECT * FROM product_detail WHERE product_id = ?',
      [pid]
    )
    const [images] = await db.query(
      'SELECT * FROM images_product WHERE product_id = ?',
      [pid]
    )
    const [descriptions] = await db.query(
      'SELECT * FROM description WHERE product_id = ?',
      [pid]
    )
    const [comments] = await db.query(
      `SELECT 
    comments.* ,
    users.account AS account,
    users.gender AS user_gender
    FROM 
        comments 
    LEFT JOIN
        users ON comments.user_id = users.id
    LEFT JOIN
        images_user ON comments.user_id = images_user.user_id
    WHERE
        entity_type = "product" && entity_id = ?`,
      [pid]
    )

    //將詳細資料加到相對應的id
    return product.map((product) => ({
      ...product,
      images: images,
      descriptions: descriptions,
      details: details,
      comments: comments,
    }))
  } catch (error) {
    console.error('Error in tidyProducts:', error)
    throw error
  }
}

const tidyCategories = async (categories) => {
    try{
        // 取得所有category id
        const cids = categories.map((c) => c.id);

        // 取得相對應的variet
        const[variets] = await db.query(getVariet,[cids]);

        // 加到對應的category_id
        return categories.map((category) => ({
            ...category,
            variets:variets.filter((v) => v.category_id === category.id)
        }))
    }catch(error){
        console.error('Error in tidyCategories:', error)
        throw error;
    }
}

// 商品首頁,取得所有商品的內容
router.get('/', async (req, res) => {
  try {

    // 設定預設頁數1，limit一頁限制多少筆，offset要跳過幾筆
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const offset = (page - 1) * limit;

    // 獲取分頁後商品的基本訊息
    const [products] = await db.query(getProducts,[limit,offset]);
    const [categories] = await db.query(getCategories);
    const [productsTotal] = await db.query(getProductsTotal);

    const total = productsTotal[0].total;
    const totalPages = Math.ceil(total / limit);
    

    const productWithDetails = await tidyProducts(products);
    const categoryWithVarieds = await tidyCategories(categories)

    res.json({
        products:productWithDetails,
        categories:categoryWithVarieds,
        pagination:{
            currentPage:page,
            totalPages:totalPages,
            totalItems:total,
            itemsPerPage:limit
        }
    });

  } catch (error) {
    res.status(500).json({
      error: 'fail',
      message: '獲取產品列表失敗',
    })
  }
})

// 取得特定的商品ID
router.get('/:pid', async (req, res) => {
  try {
    const id = req.params.pid
    const [product] = await db.query(getIdProduct, [id])
    const productWithDetails = await tidyProduct(product)

    res.json(productWithDetails)
  } catch (error) {
    console.error('Error in tidyProduct:', error)
    throw error
  }
})

export default router