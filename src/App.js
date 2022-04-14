import { useState, useEffect } from 'react';

import FirebaseAuthService from './FirebaseAuthService';
import LoginForm from './Components/loginForm';
import AddEditRecipeForm from './Components/AddEditRecipeForm';
import FirebaseFirestoreService from './FirebaseFirestoreService';

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("publishDateDesc");
  const [recipesPerPage, setRecipesPerPage] = useState("3");

  FirebaseAuthService.subscribeAuthChanges(setUser);

  async function fetchRecipes(cursorId = '') {
    const queries = [];
    if(categoryFilter) {
      queries.push({
        field: 'category',
        condition: '==',
        value: categoryFilter
      });
    }
    if (!user) {
      queries.push({
        field: 'isPublished',
        condition: '==',
        value: true
      })
    } 
    const orderByField = "publishDate";
    let orderByDirection;
    if(orderBy) {
      switch(orderBy) {
        case "publishDateAsc": 
          orderByDirection = 'asc';
          break;
        case "publishDateDesc": 
          orderByDirection = 'desc';
          break;
        default: 
          break;
      }
    }
    let fetchedRecipes = [];
    try {
      const response = await FirebaseFirestoreService.readDocuments({
        collection: "recipes", 
        queries: queries,
        orderByField: orderByField,
        orderByDirection: orderByDirection,
        perPage: recipesPerPage,
        cursorId: cursorId
      });
      const newRecipes = response.docs.map((recipeDoc)=>{
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);
        return ({...data, id});
      });

      if(cursorId) {
        fetchedRecipes = [...recipes, ...newRecipes];
      } else {
        fetchedRecipes = [...newRecipes];
      }
      
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    return fetchedRecipes; 
  }

  const handleRecipesPerPageChange = (e) => {
    setRecipes([]);
    setRecipesPerPage(e.target.value);
  }

  const handleLoadMore = () => {
    const lastRecipe = recipes[recipes.length - 1];
    handleFetchedRecipes(lastRecipe.id);
  } 

  useEffect(()=>{
    setLoading(true);
    fetchRecipes()
      .then(r => {
        setRecipes(r);
        //console.log(r.length);
      })
      .catch(error => {console.error(error.message); throw error; })
      .finally(()=> {
        setLoading(false);
      })
      //eslint-disable-next-line react-hooks/exhaustive-deps
  },[user, categoryFilter, orderBy, recipesPerPage])


  async function handleFetchedRecipes(cursorId = '') {
    try {
      const fetchedRecipes = await fetchRecipes(cursorId);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function handleAddRecipe (newRecipe) {
    try {
      const response = await FirebaseFirestoreService.createDocument("recipes",newRecipe);
      alert(`successfully create recipe with id = ${response.id}`)
      
      handleFetchedRecipes();

    } catch (error) {
      alert(error.message)
    }
  }

  async function handleUpdateRecipe(newRecipe, id) {
    try {
      await FirebaseFirestoreService.updateDocument("recipes",id, newRecipe);
      alert(`successfully updated recipe with id = ${id}`)
      handleFetchedRecipes();
      setCurrentRecipe(null);
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleDeleteRecipe(id) {
    const deleteConfirmation = window.confirm("do you really want to delete this?");
    if (deleteConfirmation) {
      try {
        await FirebaseFirestoreService.deleteDocument("recipes", id);
        alert(`successfully deleted recipe with id = ${id}`)
        handleFetchedRecipes();
        setCurrentRecipe(null);
        window.scrollTo(0,0);
      } catch (error) {
        alert(error.message);
        throw error;
      } 
    }
  }

  function handleEditRecipeClick (id) {
    const selectedRecipe = recipes.find((r)=>{
      return r.id === id;
    })

    if (selectedRecipe) {
      setCurrentRecipe(selectedRecipe);
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  function handleEditRecipeCancel () {
    setCurrentRecipe(null);
  }

  function lookupCategoryLabel (key) {
    const cateogries = {
      breads: 'Breads, Sandwiches & Pizza',
      eggs: 'Eggs & Breakfast',
      deserts: 'Deserts & Baked Goods',
      fish: 'Fish & Sea Food',
      veg: 'Vegetables',
    };
    return cateogries[key];
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Food Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
      <div className='main'>
        <div className='row filters'>
        <label className='recipe-label input-label'>
          Category:
          <select 
          required
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)} 
          className='select'>
              <option value=""></option>
              <option value="breads">Breads, Sandwiches & Pizza</option>
              <option value="eggs">Eggs & Breakfast</option>
              <option value="deserts">Deserts & Baked Goods</option>
              <option value="fish">Fish & Sea Food</option>
              <option value="veg">Vegetables</option>
          </select>
        </label>
        <label className='input-label'>
          <select 
          required
          value={orderBy} 
          onChange={(e) => setOrderBy(e.target.value)} 
          className='select'>
              <option value="publishDateDesc">New to Old</option>
              <option value="publishDateAsc">Old to New</option>
          </select>
        </label>
        </div>
        <div className='center'>
          <div className='recipe-list-box'>
            {loading ? (
              <div className='fire'>
                <div className='flames'>
                  <div className='flame'></div>
                  <div className='flame'></div>
                  <div className='flame'></div>
                  <div className='flame'></div>
                </div>
                <div className='logs'></div>
              </div>
            ) : null}
            {!loading && recipes && recipes.length === 0 ? (
              <h5 className='no-recipes'>No recipes found
              </h5>
            ) : null}
            {!loading && recipes && recipes.length > 0 ? <div className='recipe-list'>{recipes.map((recipe)=>{
              return(
                <div className='recipe-card' key={recipe.id}>
                  {recipe.isPublished === false ? (
                    <div className='unpublished'>
                      UNPUBLISHED
                    </div>) : null}
                  <div className='recipe-name'>{recipe.name}</div>
                  <div className='recipe-field'>Cateogry: {lookupCategoryLabel(recipe.category)}</div>
                  <div className='recipe-field'>Publish Date: {formatDate(recipe.publishDate)}</div>
                  {user ? (
                    <button className='primary-button edit-button' type='button' onClick={() => handleEditRecipeClick(recipe.id)}>
                      EDIT
                    </button>
                  ) : null}
                </div>
              );
            })}</div> : null}
          </div>

        </div>
        {loading || (recipes && recipes.length > 0) ? (
          <>
          <label className='input-label'>
            Recipes per page:
            <select 
              required
              value={recipesPerPage} 
              onChange={handleRecipesPerPageChange} 
              className='select'>
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
              </select>
          </label>
          <div className='pagination'>
            <button type='button' className='primary-button' onClick={handleLoadMore}>LOAD MORE RECIPES</button>
          </div>
          </>
        ) : null}
        {user ? <AddEditRecipeForm 
        existingRecipe={currentRecipe} 
        handleUpdateRecipe={handleUpdateRecipe} 
        handleDeleteRecipe = {handleDeleteRecipe}
        handleEditRecipeCancel={handleEditRecipeCancel}
        handleAddRecipe={handleAddRecipe} /> : null}
      </div>
    </div>
  );
}

export default App;