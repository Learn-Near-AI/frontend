import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Sun, Moon, Github, X } from "lucide-react";
import { categoryOrder } from "../data/examples";

function FiltersPanel({
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategories,
  setSelectedCategories,
  availableCategories,
  availableDifficulties,
  isDark,
  toggleTheme,
}) {
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const difficultyRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        difficultyRef.current &&
        !difficultyRef.current.contains(event.target)
      ) {
        setIsDifficultyOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (category) => {
    if (category === "All") {
      // If "All" is clicked, toggle it and clear all other selections
      setSelectedCategories((prev) => (prev.includes("All") ? [] : ["All"]));
    } else {
      // If a specific category is clicked
      setSelectedCategories((prev) => {
        // Remove "All" if it's selected
        const withoutAll = prev.filter((c) => c !== "All");

        if (withoutAll.includes(category)) {
          // If category is already selected, remove it
          const newSelection = withoutAll.filter((c) => c !== category);
          // If no categories selected, default to "All"
          return newSelection.length > 0 ? newSelection : ["All"];
        } else {
          // If category is not selected, add it
          return [...withoutAll, category];
        }
      });
    }
  };

  const removeCategory = (category) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  return (
    <div className="flex items-center gap-3">
      {/* Difficulty Filter */}
      <div className="relative" ref={difficultyRef}>
        <button
          onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-[#3e3e42] rounded-lg bg-white dark:bg-[#111216] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-colors"
        >
          <span className="text-sm font-medium">
            <span className="sm:hidden">Difficulty</span>
            <span className="hidden sm:inline">
              Difficulty: {selectedDifficulty}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isDifficultyOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDifficultyOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111216] border border-gray-200 dark:border-[#3e3e42] rounded-lg shadow-lg z-50">
            <div className="py-1">
              {availableDifficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => {
                    setSelectedDifficulty(difficulty);
                    setIsDifficultyOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-colors ${
                    selectedDifficulty === difficulty
                      ? "bg-near-primary/10 text-near-primary font-medium"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="relative" ref={categoryRef}>
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-[#3e3e42] rounded-lg bg-white dark:bg-[#111216] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-colors"
        >
          <span className="text-sm font-medium">
            Category
            {selectedCategories.length > 0 &&
            !selectedCategories.includes("All")
              ? ` (${selectedCategories.length})`
              : ""}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isCategoryOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isCategoryOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111216] border border-gray-200 dark:border-[#3e3e42] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              {/* All Category Option */}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedCategories.includes("All") ||
                    selectedCategories.length === 0
                  }
                  onChange={() => toggleCategory("All")}
                  className="w-4 h-4 accent-near-primary border-gray-500 rounded focus:ring-near-primary bg-transparent"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">All</span>
              </label>
              {availableCategories
                .sort((a, b) => {
                  const indexA = categoryOrder.indexOf(a);
                  const indexB = categoryOrder.indexOf(b);
                  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                  if (indexA !== -1) return -1;
                  if (indexB !== -1) return 1;
                  return a.localeCompare(b);
                })
                .map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 accent-near-primary border-gray-500 rounded focus:ring-near-primary bg-transparent"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{category}</span>
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Categories Tags */}
      {/* {selectedCategories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCategories.map(category => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-near-primary/20 text-near-primary rounded-full"
            >
              {category}
              <button
                onClick={() => removeCategory(category)}
                className="hover:bg-near-primary/30 rounded-full p-0.5"
                aria-label={`Remove ${category} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )} */}
    </div>
  );
}

export default FiltersPanel;
