import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowBooks = () => {
    const url='http://localhost:8080/book';
    const [books,setBooks]= useState([]);
    const [id,setId]= useState('');
    const [title,setTitle]= useState('');
    const [author,setAuthor]= useState('');
    const [year_publication,setYear_publication]= useState('');
    const [genre,setGenre]= useState('');
    const [operation,setOperation]= useState(1);
    const [name,setName]= useState('');

    
    useEffect( ()=>{
        getBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

      
    const getBooks = async () => {
        const respuesta = await axios.get(url);
        setBooks(respuesta.data);
    }    
    const openModal = (op, id, title, author, year_publication, genre) =>{
        setId('');
        setTitle('');
        setAuthor('');
        setYear_publication('');
        setGenre('');
        setOperation(op);
        if(op === 1){
            setName('Registrar Libro');
        }
        else if(op === 2){
            setName('Editar Libro');
            setId(id);
            setTitle(title);
            setAuthor(author);
            setYear_publication(year_publication);
            setGenre(genre);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        var queryParams ="";
        if(title.trim() === ''){
            show_alerta('Escribe el titulo del libro','warning');
        }
        else if(author.trim() === ''){
            show_alerta('Escribe el autor del libro','warning');
        }
        else if(year_publication.trim() === ''){
            show_alerta('Escribe el año de publicacion','warning');
        }
        else if(genre.trim() === ''){
            show_alerta('Escribe el genero del libro','warning');
        }

        else{
            if(operation === 1){
                parametros= {title:title.trim(),author: author.trim(), year_publication: year_publication.trim(), genre: genre.trim()};
                metodo= 'POST';
            }
            else{
                parametros= {id:id, title:title.trim(),author: author.trim(), year_publication: year_publication.trim(), genre: genre.trim()};
                metodo= 'PUT';
                queryParams = "/"+id;
            }
            envarSolicitud(metodo,parametros,queryParams);
        }
    }
    const envarSolicitud = async(metodo,parametros,queryParams) => {
        var urlBook = url+queryParams;
        await axios({ method:metodo, url: urlBook, data:parametros}).then(function(respuesta){
            console.log(respuesta)
            if(respuesta.status === 200 || respuesta.status === 201 ){
                document.getElementById('btnCerrar').click();
                show_alerta("","success");
                getBooks();
            }else{
                show_alerta("","error");
            }
           
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteBook= (id,title) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro de eliminar el libro '+title+' ?',
            icon: 'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                envarSolicitud('DELETE',{},"/"+id);
            }
            else{
                show_alerta('El libro NO fue eliminado','info');
            }
        });
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalBooks'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>LIBRO</th><th>AUTOR</th><th>AÑO DE PUBLICACION</th><th>GENERO</th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {books.map( (book,i)=>(
                                    <tr key={book.id}>
                                        <td>{(i+1)}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.year_publication}</td>
                                        <td>{book.genre}</td>
                                        <td>
                                            <button onClick={() => openModal(2,book.id,book.title,book.author,book.year_publication,book.genre)}
                                                 className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalBooks'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp; 
                                            <button onClick={()=>deleteBook(book.id,book.title)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalBooks' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{name}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-book'></i></span>
                            <input type='text' id='titulo' className='form-control' placeholder='Titulo' value={title}
                            onChange={(e)=> setTitle(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-circle-user'></i></span>
                            <input type='text' id='author' className='form-control' placeholder='Autor' value={author}
                            onChange={(e)=> setAuthor(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-calendar-days'></i></span>
                            <input type='text' id='year_publication' className='form-control' placeholder='Año de publicación' value={year_publication}
                            onChange={(e)=> setYear_publication(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='genre' className='form-control' placeholder='Género de la pelicula' value={genre}
                            onChange={(e)=> setGenre(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowBooks