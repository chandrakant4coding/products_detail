import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./ProductPage.module.css";

export default function ProductPage({ product: initialProduct, totalProducts }) {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader while fetching product data
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Hide loader after fetching data
      }
    };

    // Only fetch data if router is ready (i.e., when `id` is available)
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleNextProduct = () => {
    const nextId = parseInt(id) < totalProducts ? parseInt(id) + 1 : 1;
    router.push(`/product/${nextId}`);
  };

  const handlePreviousProduct = () => {
    const prevId = parseInt(id) > 1 ? parseInt(id) - 1 : totalProducts;
    router.push(`/product/${prevId}`);
  };

  const shareProduct = async () => {
    const productUrl = `https://products-detail-722l.vercel.app/product/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: productUrl,
        });
        console.log("Product shared successfully");
      } catch (error) {
        console.error("Error sharing the product:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(productUrl);
        alert("Product URL copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy the URL:", error);
      }
    }
  };

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{product.title}</title>
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta
          property="og:url"
          content={`https://products-detail-722l.vercel.app/product/${id}`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      <div className={styles.productDetails}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.productImage}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "auto",
          }}
        >
          <div className={styles.productInfo}>
            <h1>{product.title}</h1>
            <p className={styles.rating}>
              <strong>{product.rating.rate}</strong> | {product.rating.count}{" "}
              Ratings
            </p>
            <hr />
            <p className={styles.price}>Price: ${product.price}</p>
            <p>{product.description}</p>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={handlePreviousProduct}>
              Previous
            </button>
            <button className={styles.button} onClick={handleNextProduct}>
              Next
            </button>
            <button className={styles.button} onClick={shareProduct}>
              Share Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const productRes = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await productRes.json();

    const totalProductsRes = await fetch("https://fakestoreapi.com/products");
    const totalProducts = (await totalProductsRes.json()).length;

    return {
      props: {
        product,
        totalProducts,
      },
    };
  } catch (error) {
    return {
      props: {
        product: null,
        totalProducts: 0,
      },
    };
  }
}
