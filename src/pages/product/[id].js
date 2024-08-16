import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ProductPage({ product, totalProducts }) {
  const router = useRouter();
  const { id } = router.query;

  const handleNextProduct = () => {
    const nextId = parseInt(id) < totalProducts ? parseInt(id) + 1 : 1;
    router.push(`/product/${nextId}`);
  };

  const handlePreviousProduct = () => {
    const prevId = parseInt(id) > 1 ? parseInt(id) - 1 : totalProducts;
    router.push(`/product/${prevId}`);
  };

  // Share function for sharing the product URL
  const shareProduct = async () => {
    const productUrl = `https://products-detail-13bcc3n9i-chandrakant4codings-projects.vercel.app/product/${id}`;

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
      // Fallback for copying the URL to the clipboard
      try {
        await navigator.clipboard.writeText(productUrl);
        alert("Product URL copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy the URL:", error);
      }
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container">
      <Head>
        <title>{product.title}</title>
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://products-detail-13bcc3n9i-chandrakant4codings-projects.vercel.app/product/${id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} className="productImage" />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>

      <div className="buttonGroup">
        <button onClick={handlePreviousProduct}>Previous</button>
        <button onClick={handleNextProduct}>Next</button>
        <button onClick={shareProduct}>Share Product</button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  // Fetch product data
  try {
    const productRes = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await productRes.json();

    // Fetch total number of products
    const totalProductsRes = await fetch('https://fakestoreapi.com/products');
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
