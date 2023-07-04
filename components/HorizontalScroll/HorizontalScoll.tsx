import {
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import Image from 'next/image';
import styles from './HorizontalScroll.module.css';

const HorizontalScoll = ({
  children,
  containerRef,
  maxWidthPerItem,
}: {
  children: ReactNode;
  containerRef: RefObject<HTMLDivElement>;
  maxWidthPerItem: number;
}) => {
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);

  const amountScrolled = useRef(0);
  const prevWidth = useRef<number>();

  const handleElementResize = () => {
    if (containerRef.current) {
      const { clientWidth, scrollWidth } = containerRef.current;

      const postersToDisplay =
        Math.ceil(clientWidth / maxWidthPerItem) > 2
          ? Math.ceil(clientWidth / maxWidthPerItem)
          : 2;

      containerRef.current.style.setProperty(
        '--posters-displayed',
        postersToDisplay.toString()
      );

      if (clientWidth !== prevWidth.current) {
        prevWidth.current = clientWidth;
        containerRef.current.style.setProperty('--scroll-index', '0');
        amountScrolled.current = clientWidth;
        if (leftRef.current) leftRef.current.style.visibility = 'hidden';
      }
      if (rightRef.current)
        rightRef.current.style.visibility =
          clientWidth < scrollWidth ? 'visible' : 'hidden';
    }
  };

  const resizeObserver =
    typeof window !== 'undefined' && new ResizeObserver(handleElementResize);

  useLayoutEffect(() => {
    if (containerRef.current && resizeObserver)
      resizeObserver.observe(containerRef.current);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform =
        'translateX(calc(var(--scroll-index) * -100%))';
      containerRef.current.style.transition = 'transform 500ms ease-in-out';
    }
  }, [containerRef, maxWidthPerItem]);

  const handleScrollLeft = () => {
    if (containerRef.current && leftRef.current) {
      const { clientWidth } = containerRef.current;
      let scrollAmount = 1;

      if (amountScrolled.current - clientWidth < clientWidth) {
        scrollAmount = (amountScrolled.current - clientWidth) / clientWidth;
        amountScrolled.current = clientWidth;
      } else amountScrolled.current -= clientWidth;

      const scrollIndex = Number(
        getComputedStyle(containerRef.current).getPropertyValue(
          '--scroll-index'
        )
      );

      containerRef.current.style.setProperty(
        '--scroll-index',
        (scrollIndex - scrollAmount).toString()
      );

      if (
        rightRef.current &&
        getComputedStyle(rightRef.current).getPropertyValue('visibility') ===
          'hidden'
      )
        rightRef.current.style.visibility = 'visible';

      if (amountScrolled.current <= clientWidth)
        leftRef.current.style.visibility = 'hidden';
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current && rightRef.current) {
      const { clientWidth, scrollWidth } = containerRef.current;
      let scrollAmount = 1;

      if (amountScrolled.current + clientWidth > scrollWidth) {
        scrollAmount = (scrollWidth - amountScrolled.current) / clientWidth;
        amountScrolled.current = scrollWidth;
      } else amountScrolled.current += clientWidth;

      const scrollIndex = Number(
        getComputedStyle(containerRef.current).getPropertyValue(
          '--scroll-index'
        )
      );

      containerRef.current.style.setProperty(
        '--scroll-index',
        (scrollIndex + scrollAmount).toString()
      );

      if (
        leftRef.current &&
        getComputedStyle(leftRef.current).getPropertyValue('visibility') ===
          'hidden'
      )
        leftRef.current.style.visibility = 'visible';

      if (amountScrolled.current >= scrollWidth)
        rightRef.current.style.visibility = 'hidden';
    }
  };

  return (
    <div className={styles['scroll-container']}>
      <button
        ref={leftRef}
        className={styles['nav-left']}
        onClick={handleScrollLeft}
      >
        <Image src='/left.svg' alt='<' width={48} height={48} />
      </button>
      {children}
      <button
        ref={rightRef}
        className={styles['nav-right']}
        onClick={handleScrollRight}
      >
        <Image src='/right.svg' alt='>' width={48} height={48} />
      </button>
    </div>
  );
};

export default HorizontalScoll;
