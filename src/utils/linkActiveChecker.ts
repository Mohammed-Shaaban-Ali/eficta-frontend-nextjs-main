// is active parent check
interface MenuItem {
  routePath: string;
}

interface ParentMenuItem {
  items?: MenuItem[];
}

export const isActiveParent = (
  data: ParentMenuItem[] = [],
  path: string
): boolean => {
  if (data?.length !== 0) {
    return data?.some(({ items }) =>
      items?.some(
        (menu) =>
          menu.routePath.replace(/\/\d+/, "") === path.replace(/\/\d+/, "")
      )
    );
  }
  return false;
};

// is active parent childe check
export const isActiveParentChaild = (
  data: MenuItem[] = [],
  path: string
): boolean => {
  if (data?.length !== 0) {
    return data?.some(
      (menu) =>
        menu.routePath.replace(/\/\d+/, "") === path.replace(/\/\d+/, "")
    );
  }
  return false;
};

// is active link check
export const isActiveLink = (menuPath: string, routePath: string): boolean => {
  if (menuPath && routePath) {
    return menuPath.replace(/\/\d+/, "") === routePath.replace(/\/\d+/, "");
  }
  return false;
};
