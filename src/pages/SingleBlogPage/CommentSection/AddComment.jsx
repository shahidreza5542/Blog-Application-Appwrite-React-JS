import clsx from 'clsx'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import toast from 'react-hot-toast'
import { LuSend } from 'react-icons/lu'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import { AuthSlicePath } from './../../../redux/slices/Auth.slice';
import { appWriteDB } from './../../../lib/appwrite';
import { ENVObj } from '../../../lib/constant'
import { ID } from 'appwrite'
const AddComment = ({ isUpdate, setIsUpdate, id }) => {

    const authUser = useSelector(AuthSlicePath)


    const validationSchema = yup.object({
        msg: yup.string().required("Message is Required")
    })
    const initialValues = {
        msg: ""
    }
    const onSubmitHandler = async (values, helpers) => {
        try {
            if (!authUser) return


            const item = {
                user: authUser.name,
                created_at: new Date(),
                msg: values.msg,
                blog: id
            }
            await appWriteDB.createDocument(ENVObj.VITE_APPWRITE_DB_ID, ENVObj.VITE_APPWRITE_COMMENT_COLLECTION_ID, ID.unique(), item)




            helpers.resetForm()
            toast.success("Comment Added !")
            setIsUpdate(!isUpdate)

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>

            <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3">
                <Formik validationSchema={validationSchema} onSubmit={onSubmitHandler} initialValues={initialValues}>
                    {({ errors }) => (
                        <Form className="w-full relative">
                            <Field as="textarea" name="msg" id="" className='w-full py-4 px-2 rounded border outline-none placeholder:font-psmbold focus:border-btn transition-all duration-300' placeholder='Enter Comment...' />
                            <button disabled={!authUser} className={clsx('text-2xl text-white p-2 rounded-full bg-btn absolute  cursor-pointer right-3 ', errors.msg ? "bottom-10" : "bottom-3")}>
                                <LuSend />
                            </button>
                            <ErrorMessage className='text-red-500' component={'p'} name='msg' />
                        </Form>
                    )}
                </Formik>

            </div>
        </>
    )
}

export default AddComment