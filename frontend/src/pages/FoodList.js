import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/home.css";

const FoodList = () => {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const [sortBy, setSortBy] = useState("relevance");

    const [currentPage, setCurrentPage] = useState(1);
    const foodsPerPage = 9;

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/foods/")
            .then((res) => res.json())
            .then((data) => {
                setFoods(data);
                setFilteredFoods(data);
            })
            .catch((err) => console.log(err));

        fetch("http://127.0.0.1:8000/api/categories/")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const sortFoods = (list, sortValue) => {
        const sorted = [...list];

        switch (sortValue) {
            case "priceLowHigh":
                sorted.sort((a, b) => a.item_price - b.item_price);
                break;

            case "priceHighLow":
                sorted.sort((a, b) => b.item_price - a.item_price);
                break;

            case "nameAZ":
                sorted.sort((a, b) =>
                    a.item_name.localeCompare(b.item_name)
                );
                break;

            case "nameZA":
                sorted.sort((a, b) =>
                    b.item_name.localeCompare(a.item_name)
                );
                break;

            default:
                break;
        }

        return sorted;
    };

    const applyFilters = (
        searchTerm = search,
        category = selectedCategory,
        priceMin = minPrice,
        priceMax = maxPrice,
        sortOverride = sortBy
    ) => {
        let result = [...foods];

        if (searchTerm.trim()) {
            result = result.filter((food) =>
                food.item_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        if (category !== "All") {
            result = result.filter(
                (food) => food.category_name === category
            );
        }

        result = result.filter(
            (food) =>
                Number(food.item_price) >= Number(priceMin) &&
                Number(food.item_price) <= Number(priceMax)
        );

        result = sortFoods(result, sortOverride);

        setFilteredFoods(result);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters(search, selectedCategory, minPrice, maxPrice, sortBy);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        applyFilters(search, category, minPrice, maxPrice, sortBy);
    };

    const handleMinPriceInput = (e) => {
        const value = Number(e.target.value);
        setMinPrice(value);
        applyFilters(search, selectedCategory, value, maxPrice, sortBy);
    };

    const handleMaxPriceInput = (e) => {
        const value = Number(e.target.value);
        setMaxPrice(value);
        applyFilters(search, selectedCategory, minPrice, value, sortBy);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        applyFilters(search, selectedCategory, minPrice, maxPrice, value);
    };

    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage;
    const currentFoods = filteredFoods.slice(
        indexOfFirstFood,
        indexOfLastFood
    );

    const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <PublicLayout>
            <div
                className="py-5"
                style={{
                    background:
                        "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
                    minHeight: "100vh",
                }}
            >
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-2">
                            Discover Your Favorite Food
                        </h2>
                        <p className="text-muted">
                            Fresh • Delicious • Fast Delivery
                        </p>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 p-4 mb-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-8">
                                <form onSubmit={handleSearch}>
                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="fas fa-search text-primary"></i>
                                        </span>

                                        <input
                                            type="text"
                                            className="form-control border-start-0"
                                            placeholder="Search your favorite food here..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />

                                        <button
                                            className="btn btn-dark px-4"
                                            type="submit"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="col-md-4">
                                <select
                                    className="form-select form-select-lg"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="All">
                                        All Categories
                                    </option>

                                    {categories.map((cat) => (
                                        <option
                                            key={cat.id}
                                            value={cat.category_name}
                                        >
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 p-4 mb-5">
                        <div className="mb-4">
                            <h5 className="fw-bold mb-1">
                                <i className="fas fa-sliders-h text-primary me-2"></i>
                                Advanced Filters
                            </h5>
                            <p className="text-muted small mb-0">
                                Filter foods by price, category and sorting
                            </p>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-4">
                                <label className="form-label fw-semibold">
                                    Sort By
                                </label>

                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="relevance">
                                        Relevance
                                    </option>
                                    <option value="priceLowHigh">
                                        Price: Low to High
                                    </option>
                                    <option value="priceHighLow">
                                        Price: High to Low
                                    </option>
                                    <option value="nameAZ">
                                        A - Z
                                    </option>
                                    <option value="nameZA">
                                        Z - A
                                    </option>
                                </select>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label fw-semibold">
                                    Minimum Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={minPrice}
                                    onChange={handleMinPriceInput}
                                    min="0"
                                />
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label fw-semibold">
                                    Maximum Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={maxPrice}
                                    onChange={handleMaxPriceInput}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="form-label fw-bold">
                                Price Range: ₹{minPrice} - ₹{maxPrice}
                            </label>

                            <Slider
                                range
                                min={0}
                                max={500}
                                value={[minPrice, maxPrice]}
                                onChange={(value) => {
                                    const [min, max] = value;
                                    setMinPrice(min);
                                    setMaxPrice(max);
                                    applyFilters(
                                        search,
                                        selectedCategory,
                                        min,
                                        max,
                                        sortBy
                                    );
                                }}
                            />
                        </div>

                        <div className="mt-4 d-flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-pill"
                                onClick={() => {
                                    setMinPrice(0);
                                    setMaxPrice(50);
                                    applyFilters(
                                        search,
                                        selectedCategory,
                                        0,
                                        50,
                                        sortBy
                                    );
                                }}
                            >
                                Under ₹50
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-success rounded-pill"
                                onClick={() => {
                                    setMinPrice(0);
                                    setMaxPrice(100);
                                    applyFilters(
                                        search,
                                        selectedCategory,
                                        0,
                                        100,
                                        sortBy
                                    );
                                }}
                            >
                                Under ₹100
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-warning rounded-pill"
                                onClick={() => {
                                    setMinPrice(0);
                                    setMaxPrice(200);
                                    applyFilters(
                                        search,
                                        selectedCategory,
                                        0,
                                        200,
                                        sortBy
                                    );
                                }}
                            >
                                Under ₹200
                            </button>

                            <button
                                type="button"
                                className="btn btn-dark rounded-pill"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory("All");
                                    setMinPrice(0);
                                    setMaxPrice(500);
                                    setSortBy("relevance");
                                    applyFilters(
                                        "",
                                        "All",
                                        0,
                                        500,
                                        "relevance"
                                    );
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        {currentFoods.length === 0 ? (
                            <p className="text-center">
                                No foods found
                            </p>
                        ) : (
                            currentFoods.map((food) => (
                                <div
                                    className="col-lg-4 col-md-6 mb-4"
                                    key={food.id}
                                >
                                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                        <img
                                            src={`http://127.0.0.1:8000${food.image}`}
                                            className="card-img-top"
                                            alt={food.item_name}
                                            style={{
                                                height: "220px",
                                                objectFit: "cover",
                                            }}
                                        />

                                        <div className="card-body p-4">
                                            <h5 className="fw-bold">
                                                <Link
                                                    to={`/food/${food.id}`}
                                                    className="text-dark text-decoration-none"
                                                >
                                                    {food.item_name}
                                                </Link>
                                            </h5>

                                            <p className="text-muted small">
                                                {food.item_description?.slice(
                                                    0,
                                                    60
                                                )}
                                                ...
                                            </p>

                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <span className="fw-bold fs-5">
                                                    ₹ {food.item_price}
                                                </span>

                                                {food.is_available ? (
                                                    <Link
                                                        to={`/food/${food.id}`}
                                                        className="btn btn-dark rounded-pill px-3"
                                                    >
                                                        <i className="fas fa-shopping-basket me-1"></i>
                                                        Order
                                                    </Link>
                                                ) : (
                                                    <button
                                                        className="btn btn-outline-secondary rounded-pill"
                                                        disabled
                                                    >
                                                        Unavailable
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <nav className="mt-5 d-flex justify-content-center">
                            <ul className="pagination shadow-sm rounded-pill">
                                <li
                                    className={`page-item ${
                                        currentPage === 1
                                            ? "disabled"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(1)}
                                    >
                                        First
                                    </button>
                                </li>

                                <li
                                    className={`page-item ${
                                        currentPage === 1
                                            ? "disabled"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            paginate(currentPage - 1)
                                        }
                                    >
                                        Prev
                                    </button>
                                </li>

                                <li className="page-item disabled">
                                    <button className="page-link fw-bold">
                                        {currentPage} / {totalPages}
                                    </button>
                                </li>

                                <li
                                    className={`page-item ${
                                        currentPage === totalPages
                                            ? "disabled"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            paginate(currentPage + 1)
                                        }
                                    >
                                        Next
                                    </button>
                                </li>

                                <li
                                    className={`page-item ${
                                        currentPage === totalPages
                                            ? "disabled"
                                            : ""
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            paginate(totalPages)
                                        }
                                    >
                                        Last
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default FoodList;