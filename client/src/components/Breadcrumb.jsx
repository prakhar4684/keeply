import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'


export default function Breadcrumb({
  items = [],
  onNavigate
}) {


  return (

    <motion.nav

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      className="flex items-center gap-1 flex-wrap"

    >


      {

        items.map((item, idx) => {


          const isLast =
            idx === items.length - 1



          return (

<React.Fragment
    key={item.id ?? `breadcrumb-${idx}`}
>

              {isLast ? (


                <span

                  className="
                  text-sm
                  font-semibold
                  text-gray-900
                  px-2
                  py-1
                  "

                >

                  {idx === 0 && <Home size={13} />}

                  {item.name}


                </span>


              ) : (


                <button


                  onClick={() =>

                    onNavigate(
                      item,
                      idx
                    )

                  }


                  className="
                  text-sm
                  font-medium
                  text-gray-400
                  hover:text-emerald-600
                  px-2
                  py-1
                  rounded-lg
                  hover:bg-emerald-50
                  transition-all
                  duration-150
                  flex
                  items-center
                  gap-1
                  "

                >


                  {idx === 0 && <Home size={13} />}


                  {item.name}


                </button>


              )}


              {


                !isLast &&

                <ChevronRight

                  size={14}

                  className="text-gray-300 flex-shrink-0"

                />


              }



            </React.Fragment>


          )


        })


      }


    </motion.nav>

  )

}