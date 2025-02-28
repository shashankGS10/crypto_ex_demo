import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Coin {
  symbol: string;
  name: string;
  id: string;
}

interface Props {
  coin: Coin;
}

const CoinImage: React.FC<Props> = ({ coin }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoinImage = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${coin.symbol.toLowerCase()}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const data = await response.json();
        if (data && data.length > 0 && data[0].image) {
          setImageUrl(data[0].image);
        } else{
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching coin image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinImage();
  }, [coin.symbol]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !imageUrl) {
    return <div>No Image</div>; // Or a placeholder image
  }

  return (
    <Image
      src={imageUrl}
      alt={coin.name}
      width={24}
      height={24}
      className="rounded-full"
      onError={() => setError(true)}
    />
  );
};

export default CoinImage;