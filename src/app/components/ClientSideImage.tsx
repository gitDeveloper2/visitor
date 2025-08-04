'use client'
import { Box, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Kimage{
    src:string;
    alt:string;
    width?:number;
    height?:number;
   imgSx?:object;
   sx?:object;


}
const Kimage:React.FC<Kimage> = ({alt,src,height,width,imgSx,sx}) => {
    const [isClient, setisClient] = useState<boolean>(false);
    useEffect(() => {
        setisClient(true)
        return () => {
            
        };
    }, []);
    
        return(<>
        <Box 
        sx={{
            width,
            height,
            position:'relative',
            overflow:'hidden',
            ...sx
        }}>
        {!isClient?(
             <Skeleton
            variant='rectangular'
            sx={{
 width:"100%",
            height:"100%",
            transformOrigin:"center",
            transform:'scale(1)'
            }}
           
            animation="wave"
        
            />): (<Box component={'img'}
            src={src}
             alt={alt}
              loading='lazy'
              sx={{
                width:'100%',
                height:'100%',
                objectFit:'cover',
                display:'block',
                transition:'opacity 0.3s ease-in-out',
                opacity:1,
                ...imgSx
              }}  />)}
        </Box>
           </>
       )
    
   
}













export default Kimage;
