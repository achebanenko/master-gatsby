import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const BeerGridStyles = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const SingleBeerStyles = styled.div`
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--grey);
  img {
    display: grid;
    align-items: center;
    width: 100%;
    height: 200px;
    object-fit: contain;
  }
`;

export default function BeerPage({ data }) {
  const blackStar = '&#9733';
  const whiteStar = '&#9734;';
  return (
    <>
      <SEO title={`Beers! We have ${data.beers.nodes.length} in stock`} />
      <h2 className="center">
        We have {data.beers.nodes.length} beers available
      </h2>
      <BeerGridStyles>
        {data.beers.nodes.map((beer) => {
          const rating = Math.round(beer.rating.average);
          return (
            <SingleBeerStyles key={beer.id}>
              <img src={beer.image} alt={beer.name} />
              <h3>{beer.name}</h3>
              {beer.price}
              <p title={`${rating} out of 5 stars`}>
                <span
                  style={{ color: 'orange' }}
                  dangerouslySetInnerHTML={{
                    __html: blackStar.repeat(rating),
                  }}
                />
                <span
                  style={{ color: 'orange', filter: 'grayscale(100%)' }}
                  dangerouslySetInnerHTML={{
                    __html: whiteStar.repeat(5 - rating),
                  }}
                />
                <span>({beer.rating.reviews})</span>
              </p>
            </SingleBeerStyles>
          );
        })}
      </BeerGridStyles>
    </>
  );
}

export const query = graphql`
  query {
    beers: allBeer {
      nodes {
        id
        image
        name
        price
        rating {
          average
          reviews
        }
      }
    }
  }
`;
