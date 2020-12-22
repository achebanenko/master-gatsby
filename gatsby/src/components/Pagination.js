import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const PaginationStyles = styled.div`
  display: flex;
  margin: 2rem 0;
  align-items: center;
  align-content: center;
  justify-items: center;
  text-align: center;
  border: 1px solid var(--grey);
  border-radius: 5px;
  & > * {
    flex: 1;
    padding: 1rem;
    text-decoration: none;
    border-right: 1px solid var(--grey);
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
