/**
 * Recursively extracts all string/number values from an object for searching
 */
const getAllValues = (obj: any): string => {
  if (typeof obj !== "object" || obj === null) return String(obj);
  return Object.values(obj)
    .map((value) => (typeof value === "object" ? getAllValues(value) : String(value)))
    .join(" ");
};
export const processData = (
  items: any[],
  searchTerm: string,
  sortConfig: { key: string; direction: "asc" | "desc" } | null,
  activeFilters: Record<string, string[]> = {}
) => {
  let processed = [...items];

  // 1. Deep Search (Global)
  if (searchTerm) {
    const query = searchTerm.toLowerCase();
    processed = processed.filter((item) => 
      getAllValues(item).toLowerCase().includes(query)
    );
  }

  // 2. Apply Enum Filters
  Object.keys(activeFilters).forEach((key) => {
    const selectedValues = activeFilters[key];
    if (selectedValues.length > 0) {
      processed = processed.filter((item) => {
        const val = key.split('.').reduce((acc, part) => acc?.[part], item);
        return selectedValues.includes(String(val));
      });
    }
  });

  // 3. Dynamic Sort
  if (sortConfig) {
    processed.sort((a, b) => {
      const getVal = (obj: any, path: string) =>
        path.split(".").reduce((acc, part) => acc?.[part], obj);

      const valA = String(getVal(a, sortConfig.key) || "").toLowerCase();
      const valB = String(getVal(b, sortConfig.key) || "").toLowerCase();

      return sortConfig.direction === "asc" 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    });
  }

  return processed;
};

/**
 * Heuristic to find "Enum" fields (keys where values repeat often)
 */
/**
 * Robustly detects "Enum" fields by traversing nested objects and 
 * calculating the ratio of unique values to total entries.
 */
export const detectEnums = (items: any[], threshold = 0.4, maxUnique = 12) => {
  if (!items || items.length === 0) return {};

  const valueMap: Record<string, Set<any>> = {};
  const totalCounts: Record<string, number> = {};

  // 1. Flattened Deep Traversal
  items.forEach((item) => {
    const flatten = (obj: any, prefix = "") => {
      if (obj === null || typeof obj !== "object") return;

      Object.entries(obj).forEach(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value !== "object") {
          if (!valueMap[path]) {
            valueMap[path] = new Set();
            totalCounts[path] = 0;
          }
          valueMap[path].add(value);
          totalCounts[path]++;
        } else if (typeof value === "object" && !Array.isArray(value)) {
          flatten(value, path);
        }
      });
    };
    flatten(item);
  });

  const enumMap: Record<string, any[]> = {};

  // 2. Statistical Heuristic
  Object.keys(valueMap).forEach((path) => {
    const uniqueValues = Array.from(valueMap[path]);
    const totalCount = totalCounts[path];
    
    // Calculate uniqueness ratio (e.g., 2 unique / 100 items = 0.02)
    const ratio = uniqueValues.length / totalCount;

    /**
     * Criteria for an Enum:
     * - Has more than 1 value (not a constant)
     * - Fewer unique values than the 'maxUnique' ceiling (e.g., 12 months, 7 days)
     * - Ratio is below threshold (avoids marking IDs as enums in tiny datasets)
     */
    if (
      uniqueValues.length > 1 && 
      uniqueValues.length <= maxUnique && 
      ratio <= threshold
    ) {
      enumMap[path] = uniqueValues.sort();
    }
  });

  return enumMap;
};