import { useState, useEffect } from 'react';

function AddEditRecipeForm ({ existingRecipe, handleAddRecipe, handleUpdateRecipe, handleEditRecipeCancel, handleDeleteRecipe }) {

    useEffect (()=>{
        if(existingRecipe) {
            setName(existingRecipe.name);
            setCategory(existingRecipe.category);
            setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
            setDirections(existingRecipe.directions);
            setIngredients(existingRecipe.ingredients);
        } else {
            resetForm();
        }
    },[existingRecipe])

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
    const [directions, setDirections] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [ingredientName, setIngredientName] = useState("");

    function handleRecipeFormSubmit(e) {
        e.preventDefault();

        if(ingredients.length === 0) {
            alert('ingredients cannot be empty');
            return;
        }

       const isPublished = new Date(publishDate) <= new Date() ? true : false;
       const newRecipe = {
           name, 
           category, 
           publishDate: new Date(publishDate), 
           directions, 
           ingredients, 
           isPublished
       }
       if (existingRecipe) {
           handleUpdateRecipe(newRecipe, existingRecipe.id)
       } else {
        handleAddRecipe(newRecipe);
       }
       resetForm();
    }
    
    function handleAddIngredient(e) {
        if(e.key && e.key !== 'Enter') {
            return;
        }

        e.preventDefault();

        if(!ingredientName) {
            alert('Missing ingredient name');
            return;
        }
        setIngredients([...ingredients, ingredientName]);
        setIngredientName("");
    }

    function handleDeleteIngredient(del) {
        //e.preventDefault();
        const newIngredients = ingredients.filter(item => item !== del);
        setIngredients(newIngredients);
    }

    function resetForm() {
        setName("");
        setCategory("");
        setPublishDate(new Date().toISOString().split("T")[0]);
        setDirections("");
        setIngredients([]);
    }


    return (
        <form onSubmit={handleRecipeFormSubmit} className="add-edit-recipe-form-container">
            <h2>{existingRecipe ? 'Update' : 'Add'} a New Recipe</h2>
            <div className='top-form-section'>
                <div className='fields'>
                    <label className='recipe-label input-label'>
                        Recipe Name:
                        <input type='text' 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className='input-text' />
                    </label>
                    <label className='recipe-label input-label'>
                        Category:
                        <select 
                        required
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className='select'>
                            <option value=""></option>
                            <option value="breads">Breads, Sandwiches & Pizza</option>
                            <option value="eggs">Eggs & Breakfast</option>
                            <option value="deserts">Deserts & Baked Goods</option>
                            <option value="fish">Fish & Sea Food</option>
                            <option value="veg">Vegetables</option>
                        </select>
                    </label>
                    <label className='recipe-label input-label'>
                        Directions:
                        <textarea
                        required 
                        value={directions} 
                        onChange={(e) => setDirections(e.target.value)} 
                        className='input-text directions' />
                    </label>
                    <label className='recipe-label input-label'>
                        Publish Date:
                        <input type='date' 
                        required 
                        value={publishDate} 
                        onChange={(e) => setPublishDate(e.target.value)} 
                        className='input-text' />
                    </label>
                </div>
            </div>
            <div className='ingredients-list'>
                <h3 className='text-center'>Ingredients</h3>
                    <table className='ingredients-table'>
                        <thead>
                            <tr>
                                <th className='table-header'>Ingredients</th>
                                <th className='table-header'>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            { ingredients && ingredients.length > 0 ? ingredients.map((i) => {
                                return (
                                <tr key={i}>
                                    <td className='table-data text-center'>{i}</td>
                                    <td className='ingredient-delete-box'>
                                        <button type='button' 
                                        className='secondary-button ingredient-delete-button'
                                        onClick={() => handleDeleteIngredient(i)}>delete</button>
                                    </td>
                                </tr>);
                            }): null}
                        </tbody>
                    </table>
                    { ingredients && ingredients.length === 0 ? 
                    <h3 className='text-center no-ingredients'>No ingredients added</h3> : null}
                    <div className='ingredient-form'>
                        <label className='ingredient-label'>
                            Ingredient:
                            <input type='text'  
                                value={ingredientName} 
                                onChange={(e) => setIngredientName(e.target.value)} 
                                className='input-text' 
                                onKeyPress={handleAddIngredient}
                                placeholder='eg. 1 cup of flour'/>
                        </label>
                        <button 
                            type='button' 
                            className='primary-button add-ingredient-button' 
                            onClick={handleAddIngredient}>Add Ingredient</button>
                    </div>
            </div>
            <div className='action-buttons'>
                <button type='submit' className='primary-button action-button'> {existingRecipe ? 'Update' : 'Create'} Recipe</button>
                {existingRecipe ? (
                    <>
                    <button type="button" 
                    className='primary-button action-button' 
                    onClick={handleEditRecipeCancel}>Cancel</button>
                    <button type="button" 
                    className='primary-button action-button' 
                    onClick={() => handleDeleteRecipe(existingRecipe.id)}>Delete</button>
                    </>
                ) : null}
            </div>

        </form>
    );

}

export default AddEditRecipeForm;
