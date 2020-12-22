# Master Gatsby
https://github.com/wesbos/master-gatsby



## 50. Deploying to Netlify

$ cd master-gatsby
$ git init
$ touch .gitignore
$ git status
 



## 49. Building Gatsby Site

$ npm run build



## 48. Building and Deploying Sanity

$ mkdir static
# if error (no such file or directory) when minifying javascript bundles

$ sanity deploy

https://slicksslicesart.sanity.studio/desk




## 47. Displaying the Home Page Data

pages/index.js
```
import React from 'react';
import useLatestData from '../utils/useLatestData';
import { HomePageGrid } from '../styles/Grids';
import LoadingGrid from '../components/LoadingGrid';
import ItemGrid from '../components/ItemGrid';

function CurrentlySlicing({ slicemasters }) {
  return (
    <div>
      <h2 className="center">
        <span className="mark tilt">Slicemasters On</span>
      </h2>
      <p>Standing by, ready to slice you up!</p>
      {!slicemasters && <LoadingGrid count={4} />}
      {slicemasters && !slicemasters?.length && (
        <p>No one is working right now!</p>
      )}
      {slicemasters?.length && <ItemGrid items={slicemasters} />}
    </div>
  );
}

function HotSlices({ hotSlices }) {
  return (
    <div>
      <h2 className="center">
        <span className="mark tilt">Hot Slices</span>
      </h2>
      <p>Come on by, buy the slice!</p>
      {!hotSlices && <LoadingGrid count={4} />}
      {hotSlices && !hotSlices?.length && <p>Nothin' in the Case!</p>}
      {hotSlices?.length && <ItemGrid items={hotSlices} />}
    </div>
  );
}

export default function HomePage() {
  const { slicemasters, hotSlices } = useLatestData();
  return (
    <div className="center">
      <h1>The Best Pizza Downtown!</h1>
      <p>Open 11am to 11pm Every Single Day</p>
      <HomePageGrid>
        <CurrentlySlicing slicemasters={slicemasters} />
        <HotSlices hotSlices={hotSlices} />
      </HomePageGrid>
    </div>
  );
}
```

components/ItemGrid.js
```
import React from 'react';
import { ItemsGrid, ItemStyles } from '../styles/Grids';

export default function ItemGrid({ items }) {
  return (
    <ItemsGrid>
      {items.map((item) => (
        <ItemStyles>
          <p>
            <span className="mark">{item.name}</span>
          </p>
          <img
            src={`${item.image.asset.url}?w=500&h=400&fit=crop`}
            alt={item.name}
            width="500"
            height="400"
            style={{
              background: `url(${item.image.asset.metadata.lqip})`,
              backgroundSize: 'cover',
            }}
          />
        </ItemStyles>
      ))}
    </ItemsGrid>
  );
}
```



## 46. Creating a Skeleton Screen

Transparent base64 png pixel generator
https://png-pixel.com/


Components/LoadingGrid.js
```
import React from 'react';
import { ItemsGrid, ItemStyles } from '../styles/Grids';

export default function LoadingGrid({ count }) {
  return (
    <ItemsGrid>
      {Array.from({ length: count }, (_, i) => (
        <ItemStyles>
          <p>
            <span className="mark">Loading...</span>
          </p>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAECAQAAADsOj3LAAAADklEQVR42mNkgANGQkwAAJoABWH6GPAAAAAASUVORK5CYII="
            className="loading"
            alt="Loading"
            width="500"
            height="400"
          />
        </ItemStyles>
      ))}
    </ItemsGrid>
  );
}
``` 

styles/Grids.js
```
...

export const ItemStyles = styled.div`
  text-align: center;
  position: relative;
  img {
    border: 1px solid gray;
    height: auto;
    font-size: 0;
  }
  p {
    position: absolute;
    left: 0;
    width: 100%;
    transform: rotate(-2deg) translateY(-50%);
  }
  .mark {
    display: inline;
  }
  @keyframes shine {
    from {
      background-position: 200%;
    }
    to {
      background-position: -40px;
    }
  }
  img.loading {
    --shine: white;
    --background: var(--grey);
    background-image: linear-gradient(
      90deg,
      var(--background) 0px,
      var(--shine) 40px,
      var(--background) 80px
    );
    background-size: 500px;
    animation: shine 1s infinite linear;
  }
`;
```


## 45. Client Side Data Fetching

It will give you a url to your  graphql database
% sanity $ sanity graphql list

utils/useLatestData.js
```
import { useEffect, useState } from 'react';

const gql = String.raw;

const deets = `
  name
  _id
  image {
    asset {
      url
      metadata {
        lqip
      }
    }
  }
`;

export default function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();

  useEffect(function () {
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemaster {
                ${deets}
              }
              hotSlices {
                ${deets}
              }
            }
          }
          `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return {
    hotSlices,
    slicemasters,
  };
}
```

pages/index.js



## 44. Creating an one-off store settings page (% sanity)

sidebar.js
```
import React from 'react';
import S from '@sanity/desk-tool/structure-builder';

// build a custom sidebar
export default function Sidebar() {
  return S.list()
    .title(`Slick's Slices`)
    .items([
      // create a new sub item
      S.listItem()
        .title('Home Page')
        .icon(() => <strong>&#x1F525;</strong>)
        .child(
          S.editor()
            .schemaType('storeSettings')
            // make a new document ID, so we don't have a random string
            .documentId('downtown')
        ),
      // add in the rest of our document items
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'storeSettings'
      ),
    ]);
}
```

sanity.json
```
{
  ...
  "parts": [
    ...
    {
      "name": "part:@sanity/desk-tool/structure",
      "path": "./sidebar.js"
    }
  ]
}
```

schemas/storeSettings.js
schemas/schema.js

$ sanity graphql deploy production



## 43. Honey Pot to defend against bots

pages/order.js
```
...
<input
  type="mapleSyrup"
  name="mapleSyrup"
  value={values.mapleSyrup}
  onChange={updateValue}
  className="mapleSyrup"
/>
...
```

styles/OrderStyles.js
```
...
.mapleSyrup {
  display: none;
}
...
```

functions/placeOrder/placeOrder.js
```
...
if (body.mapleSyrup) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Boop beep bop zzzstt good bye',
    }),
  };
}
...
```



## 41-42. Serverless function

functions/placeOrder/placeOrder.js
```
const nodemailer = require('nodemailer');

function generateOrderEmail({ order, total }) {
  return `<div>
    <h2>Your recent order for ${total}</h2>
    ...
  </div>`;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function wait(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

exports.handler = async (event, context) => {
  await wait(3000);
  const body = JSON.parse(event.body);
  const requiredFields = ['name', 'email', 'order'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Oops! You are missing the ${field} field`,
        }),
      };
    }
  }

  const info = await transporter.sendMail({
    from: "Slick's Slices <slick@example.com>",
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: 'New Order!',
    html: generateOrderEmail({ order: body.order, total: body.total }),
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success',
    }),
  };
};
```


## 40. Modifying custom hook

utils/usePizza.js
```
import { useContext, useState } from 'react';
import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from './attachNamesAndPrices';
import calculateOrderTotal from './calculateOrderTotal';
import formatMoney from './formatMoney';

export default function usePizza({ pizzas, values }) {
  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  function removeFromOrder(index) {
    setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
  }

  async function submitOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const body = {
      order: attachNamesAndPrices(order, pizzas),
      total: formatMoney(calculateOrderTotal(order, pizzas)),
      name: values.name,
      email: values.email,
    };

    const res = await fetch(
      `${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const text = JSON.parse(await res.text());

    if (res.status >= 400 && res.status < 600) {
      setLoading(false);
      setError(text.message);
    } else {
      setLoading(true);
      setMessage('Success! Come on down for your pizza');
    }
  }

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message,
    submitOrder,
  };
}
```



## 39. Intro to Serverless functions

Testing https://ethereal.email/
Production https://postmarkapp.com/ or https://sendgrid.com/

$ cd functions/placeOrder
$ npm init
$ npm i nodemailer

$ npm run netlify

netlify.toml
```
[build]
  functions = "functions/"
```

functions/placeOrder.js

.env
```
...
MAIL_HOST=smtp.ethereal.email
MAIL_USER=yasmine.flatley@ethereal.email
MAIL_PASS=VNVvmJftFxehxQkEN1
GATSBY_SERVERLESS_BASE=http://localhost:8888/.netlify/functions
```



## 38. React Context with a custom Provider

components/OrderContext.js
```
import React, { useState } from 'react';

const OrderContext = React.createContext();

export function OrderProvider({ children }) {
  const [order, setOrder] = useState([]);
  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
```

gatsby-browser.js
gatsby-ssr.js
```
import { OrderProvider } from './src/components/OrderContext';
...
export function wrapRootElement({ element }) {
  return <OrderProvider>{element}</OrderProvider>;
}
```

utils/usePizza.js
```
import { useContext } from 'react';
import OrderContext from '../components/OrderContext';

export default function usePizza({ pizzas, inputs }) {
  const [order, setOrder] = useContext(OrderContext);
  ...
}
```



## 36. Order hook

components/PizzaOrder.js

utils/usePizza.js
```
import { useState } from 'react';

export default function usePizza({ pizzas, values }) {
  const [order, setOrder] = useState([]);
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  function removeFromOrder(index) {
    setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
  }
  return {
    order,
    addToOrder,
    removeFromOrder,
  };
}
```


## 34. Order page

pages/order.js

utils/useForm.js
```
import { useState } from 'react';

export default function useForm(defaults) {
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    let { value } = e.target;
    if (e.target.type === 'number') {
      value = parseInt(value);
    }
    setValues({
      ...values,
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}
```


## 33. SEO and Head tags 

gatsby-config.js
```
...
export default {
  ...
  plugins: [
    'gatsby-plugin-react-helmet',
    ...
  ]
}
```

components/SEO.js
```
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

export default function SEO({ children, location, description, title, image }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);
  return (
    <Helmet titleTemplate={`%s - ${site.siteMetadata.title}`}>
      <html lang="en" />
      <title>{title}</title>
      {/* Fav Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="alternte icon" href="/favicon.ico" />
      {/* Meta Tags */}
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta charset="utf-8" />
      <meta name="description" content={site.siteMetadata.description} />
      {/* Open Graph */}
      {location && <meta property="og:url" content={location.href} />}
      <meta property="og:image" content={image || '/logo.svg'} />
      <meta property="og:title" content={title} key="ogtitle" />
      ...
      {children}
    </Helmet>
  );
}
```

templates/Pizza.js
```
...
import SEO from '../components/SEO';

export default function SinglePizzaPage({ data: { pizza } }) {
  return (
    <>
      <SEO title={pizza.name} image={pizza.image?.asset?.fluid?.src} />
      ...
    </>
  );
}
...
```


## 28-31. Paginating Data

.env
```
GATSBY_PAGE_SIZE=3
GATSBY_HOT_LOADER=fast-refresh
```

gatsby-node.js
```
...
async function turnSlicemastersIntoPages({ graphql, actions }) {
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          id
          name
          slug {
            current
          }
        }
      }
    }
  `);

  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

  Array.from({ length: pageCount }).forEach((_, i) => {
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      },
    });
  });
}
...
```

pages/slicemasters.js
```
...
export default function SlicemastersPage({ data, pageContext }) {
  const slicemasters = data.slicemasters.nodes;
  return (
    <>
      <Pagination
        totalCount={data.slicemasters.totalCount}
        pageSize={parseInt(process.env.GATSBY_PAGE_SIZE)}
        currentPage={pageContext.currentPage || 1}
        base="/slicemasters"
      />
      ...
    </>
  );
}

export const query = graphql`
  query($skip: Int = 0, $pageSize: Int = 3) {
    slicemasters: allSanityPerson(limit: $pageSize, skip: $skip) {
      totalCount
      nodes {
        ...
      }
    }
  }
`;
```

components/Pagination.js
```
...
const PaginationStyles = styled.div`
  ...
  & > * {
    ...
    &[aria-current],
    &.current {
      color: var(--red);
    }
    &[disabled] {
      pointer-events: none;
      color: var(--grey);
    }
  }
`;

export default function Pagination({
  pageSize,
  totalCount,
  currentPage,
  base,
}) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasNextPage = nextPage <= totalPages;
  const hasPrevPage = prevPage >= 1;
  return (
    <PaginationStyles>
      <Link to={`${base}/${prevPage}`} disabled={!hasPrevPage}>
        &#8592; Prev
      </Link>
      {Array.from({ length: totalPages }).map((_, i) => (
        <Link
          key={i}
          className={currentPage === 1 && i === 0 ? 'current' : ''}
          to={`${base}/${i > 0 ? i + 1 : ''}`}
        >
          {i + 1}
        </Link>
      ))}
      <Link to={`${base}/${nextPage}`} disabled={!hasNextPage}>
        &#8594; Next
      </Link>
    </PaginationStyles>
  );
}
```



## 26. Sourcing data from an external api

https://sampleapis.com/

gatsby-node.js
```
import fetch from 'isomorphic-fetch';
...

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  const res = await fetch('https://sampleapis.com/beers/api/ale');
  const beers = await res.json();

  // Create a node for each beer
  for (const beer of beers) {
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };

    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
}

export async function sourceNodes(params) {
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

...
```



## 25. Dynamically creating toppings pages

gatsby-node.js
```
...

async function turnToppingsIntoPages({ graphql, actions }) {
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          id
          name
        }
      }
    }
  `);

  data.toppings.nodes.forEach((topping) => {
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        toppingRegex: `/${topping.name}/i`,
      },
    });
  });
}

export async function createPages(params) {
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
  ]);
}
```

pages/pizzas.js
```
...

export default function PizzasPage({ data, pageContext }) {
  const pizzas = data.pizzas.nodes;
  return (
    <>
      <ToppingsFilter activeTopping={pageContext.topping} />
      <PizzaList pizzas={pizzas} />
    </>
  );
}

export const query = graphql`
  query PizzaQuery($toppingRegex: String) {
    pizzas: allSanityPizza(
      filter: { toppings: { elemMatch: { name: { regex: $toppingRegex } } } } # in: $topping
    ) {
      nodes {
        ...
      }
    }
  }
`;
```

## 23. Dynamically creating pages with gatsby-node

gatsby-node.js
```
import path from 'path';

async function turnPizzasIntoPages({ graphql, actions }) {
  const PizzaTemplate = path.resolve('./src/templates/Pizza.js');
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);

  data.pizzas.nodes.map((pizza) => {
    actions.createPage({
      path: `pizza/${pizza.slug.current}`,
      component: PizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

export async function createPages(params) {
  await turnPizzasIntoPages(params);
}
```

components/Pizza.js
```
import React from 'react';
import { graphql } from 'gatsby';

export default function SinglePizzaPage({ data: { pizza } }) {
  console.log(pizza);
  return <p>Single Pizza</p>;
}

export const query = graphql`
  query($slug: String!) {
    pizza: sanityPizza(slug: { current: { eq: $slug } }) {
      id
      name
      image {
        asset {
          fluid(maxWidth: 800) {
            ...GatsbySanityImageFluid
          }
        }
      }
      toppings {
        id
        name
        vegetarian
      }
    }
  }
`;
```


## 22. Static Queries

components/ToppingsFilter.js
```
...
export default function ToppingsFilter() {
  const { toppings, pizzas } = useStaticQuery(graphql`
    query {
      #   toppings: allSanityTopping {
      #     nodes {
      #       name
      #       id
      #       vegetarian
      #     }
      #   }
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);

  console.clear();
  console.log({ toppings, pizzas });

  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);

  return (
    ...
  )
};
...
```


## 21. Styling with CSS subgrid

components/PizzaList.js
```
...
const PizzaGridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 4rem;
  grid-auto-rows: auto auto 500px;
`;

const PizzaStyles = styled.div`
  display: grid;
  /* @supports not (grid-template-rows: subgrid) {
    grid-template-rows: auto auto 1fr;
  }
  grid-template-rows: subgrid; */
  @supports not (grid-template-rows: subgrid) {
    --rows: auto auto 1fr;
  }
  grid-template-rows: var(--rows, subgrid);
  grid-row: span 3;
  grid-gap: 1rem;
  h2,
  p {
    margin: 0;
  }
`;
...
```


## 20. Loading in sample data

$ sanity % sanity dataset import ./sample-data/all-sample-data.gz production --replace


## 19. Gatsby images

pages/pizzas.js
```
...
export const query = graphql`
  query PizzaQuery {
    pizzas: allSanityPizza {
      nodes {
        ...
        image {
          asset {
            fixed(width: 400, height: 400) {
              ...GatsbySanityImageFixed
            }
            fluid(maxWidth: 400) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;

```

components/PizzaList.js
```
...
function SinglePizza({ pizza }) {
  return (
    <div>
      ...
      {/* <Img fixed={pizza.image.asset.fixed} alt={pizza.name} /> */}
      <Img fluid={pizza.image.asset.fluid} alt={pizza.name} />
    </div>
  );
}
...
```


## 18. Gatsby queries

pages/pizzas.js
```
import React from 'react';
import { graphql } from 'gatsby';
import PizzaList from '../components/PizzaList';

export default function PizzasPage({ data }) {
  const pizzas = data.pizzas.nodes;
  return (
    <>
      <PizzaList pizzas={pizzas} />
    </>
  );
}

export const query = graphql`
  # query name is unnecessary
  query PizzaQuery {
    # renaming query
    pizzas: allSanityPizza {
      nodes {
        name
        id
        slug {
          current
        }
        toppings {
          id
          name
        }
        image {
          asset {
            fluid(maxWidth: 400) {
              # fragment from the sanity plugin for querying everything
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
```


## 17. Sourcing Sanity data and GraphQL intro

gatsby-config.js
```
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default {
  ...
  plugins: [
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'hithf087',
        dataset: 'production',
        watchMode: true,
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
```

$ sanity % sanity graphql deploy production
$ gatsby % npm start


Playground https://hithf087.api.sanity.io/v1/graphql/production/default
```
query {
  allPizza {
    name
  }
}
```

GraphiQL http://localhost:8000/___graphql
```
query MyQuery {
  sanityPizza(id: {eq: "-880ea89b-72b0-550d-9a44-d75bc8e9e138"}) {
    name
  }
  sanityPizza(name: {regex: "/veggie/i"}) {
    name
  }
  allSanityPizza {
    nodes {
      id
      name
      slug {
        current
      }
      price
      toppings{
        name
      }
    }
  }
  allSanityPerson {
    nodes {
      name
    }
  }
}
```


## 16. Intro to gatsby-config

gatsby-config.js
```
export default {
  siteMetadata: {
    title: 'Slicks Slices',
    siteUrl: 'https://gatsby.pizza',
    description: 'The best pizza in town',
  },
};
```

## 15. Custom CMS inputs (% sanity)

components/PriceInput.js
```
import React from 'react';
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event';

function createPatchFrom(value) {
  return PatchEvent.from(value === '' ? unset() : set(Number(value)));
}

const formatMoney = Intl.NumberFormat('ru-Ru', {
  style: 'currency',
  currency: 'RUB',
}).format;

export default function PriceInput({ type, value, onChange, inputComponent }) {
  return (
    <div>
      <h2>
        {type.title} {value ? formatMoney(value / 100) : ''}
      </h2>
      <p>{type.description}</p>
      <input
        type={type.name}
        value={value}
        onChange={(event) => onChange(createPatchFrom(event.target.value))}
        ref={inputComponent}
      />
    </div>
  );
}
```

schemas/pizza.js
```
import { MdLocalPizza as icon } from 'react-icons/md';
import PriceInput from '../components/PriceInput';

export default {
  name: 'pizza',
  title: 'Pizzas',
  type: 'document',
  icon,
  fields: [
    ...
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price of the pizza in cents',
      validation: (Rule) => Rule.min(1000).max(5000),
      inputComponent: PriceInput,
    },
    ...
  ],
  ...
};
```



## 13. Creating data relationships (% sanity)

schemas/pizza.js
```
import { MdLocalPizza as icon } from 'react-icons/md';

export default {
  name: 'pizza',
  title: 'Pizzas',
  type: 'document',
  icon,
  fields: [
    ...
    {
      name: 'toppings',
      title: 'Toppings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topping' }] }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      topping0: 'toppings.0.name',
      topping1: 'toppings.1.name',
      topping2: 'toppings.2.name',
    },
    prepare: ({ title, media, ...toppings }) => {
      const tops = Object.values(toppings).filter(Boolean);
      return {
        title,
        media,
        subtitle: tops.join(', '),
      };
    },
  },
};
```



## 12. Toppings content type and custom previews (% sanity)

schemas/topping.js
```
import { FaPepperHot as icon } from 'react-icons/fa';

export default {
  name: 'topping',
  title: 'Toppings',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Topping name',
      type: 'string',
      description: 'What is the name of the topping?',
    },
    {
      name: 'vegetarian',
      title: 'Vegetarian',
      type: 'boolean',
      options: {
        layout: 'checkbox',
      },
    },
  ],
  preview: {
    select: {
      name: 'name',
      vegetarian: 'vegetarian',
    },
    prepare: (fields) => ({
      title: `${fields.name} ${fields.vegetarian ? '(v)' : ''}`,
    }),
  },
};
```




## 11. Setting up Sanity (% sanity)

$ npm install -g @sanity/cli
$ sanity init

$ sanity --version
$ sanity init --reconfigure

schemas/pizza.js
```
import { MdLocalPizza as icon } from 'react-icons/md';

export default {
  name: 'pizza', // computer name
  title: 'Pizzas', // visible name
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Pizza name',
      type: 'string',
      ...
    },
    ...
  ],
}
```

schemas/schema.js
```
import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';
import pizza from './pizza';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([pizza]),
});
```



## 10. Styling Layout

Layout.js
```
...
import stripes from '../assets/images/stripes.svg';

const SiteBorderStyles = styled.div`
  padding: 5px;
  padding: clamp(5px, 1vw, 25px);
  background: white url(${stripes});
  background-size: 1500px;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.044);
  ...
  @media (max-width: 1100px) {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
`;
...
```


## 09. Styling the Nav

To keep scale when change only rotate of the transform need to use css variable.

Nav.js
```
...
li {
  --rotate: -2deg;
  transform: rotate(var(--rotate)) scale(4);
  order: 1;
  &:nth-child(1) {
    --rotate: 1deg;
  }
  &:nth-child(2) {
    --rotate: -2.5deg;
  }
  &:hover {
    --rotate: 3deg;
  }
}
a {
  /* &[aria-current='page'] {
    color: var(--red);
  } */ 
}
...
```

Logo.js
```
...
font-size: 6px;
font-size: clamp(1px, 0.65vw, 8px);
width: 30em;
height: 30em;
...
```


## 08. Typography

src/styles/typography.js
```
import { createGlobalStyle } from 'styled-components';
import font from '../assets/fonts/frenchfries.woff';

const Typography = createGlobalStyle`
  @font-face {
    font-family: FrenchFries;
    src: url(${font});
  }
  html {
    font-family: FrenchFries, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: var(--black);
  }
  ...
`;

export default Typography;
```


## 07. GlobalStyles

src/styles/GlobalStyles.js
```
import { createGlobalStyle } from 'styled-components';
import bg from '../assets/images/bg.svg';

const GlobalStyles = createGlobalStyle`
  :root {
    --black: #2E2E2E;
  }
  html {
    background-image: url(${bg});
  }

  .gatsby-image-wrapper img[src*=base64\\,] {
    image-rendering: -moz-crisp-edges;
    image-rendering: pixelated;
  }

  ...
`;

export default GlobalStyles;
```


## 06. Creating layouts

Implement any of Gatsby Browser APIs by exporting them from a file named gatsby-browser.js in the root of your project.

wrapPageElement
Allow a plugin to wrap the page element. This is useful for setting wrapper components around pages that won’t get unmounted on page changes. There is an equivalent hook in Gatsby’s SSR API. It is recommended to use both APIs together.
https://www.gatsbyjs.com/docs/browser-apis/#wrapPageElement

See files gatsby-browser.js and gatsby-ssr.js in the root gatsby (frontend) folder.

```
...
export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>;
}
```

