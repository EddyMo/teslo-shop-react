import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductByIdAction } from "../actions/get-product-by-id.action";
import { createUpdateProductAction } from "../actions/create-update-product.action";
import type { Product } from "@/interfaces/product.interface";

export const useProduct = (id: string) => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProductByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Mutación
  const productMutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {

      // Invalidar Cache
      // Se invalida los querys anteriones cuando se hizo una actualización o creación
      // para que el resultado se refleje en las páginas actualizadas
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', { id: product.id }] });

      // Actualizar QueryData
      queryClient.setQueryData(['products', { id: product.id }], product);

      // console.log('Todo salió bien', product);
    }
  });



  return { ...query, productMutation };
}
