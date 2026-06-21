"use client";
import { useRouter, usePathname, useParams as nextUseParams } from 'next/navigation';
import NextLink from 'next/link';
import { useEffect } from 'react';

export const useNavigate = () => {
  const router = useRouter();
  return (path, options) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  return { pathname, search: '', hash: '', state: null }; // Mock minimal location object
};

export const useParams = () => {
  return nextUseParams() || {};
};

export const Link = ({ to, children, ...props }) => {
  return <NextLink href={to || props.href || "#"} {...props}>{children}</NextLink>;
};

export const NavLink = ({ to, children, className, style, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  const computedClassName = typeof className === 'function' ? className({ isActive }) : className;
  return <NextLink href={to} className={computedClassName} style={style} {...props}>{typeof children === 'function' ? children({ isActive }) : children}</NextLink>;
};

export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
};

export const Outlet = ({ children }) => <>{children}</>;
