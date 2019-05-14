import { Injectable } from "@angular/core";
import { GearItem } from "../../models/gear-item.model";
import { MatPaginator } from "@angular/material";

@Injectable()
export class PaginatorService {
  constructor() {}

  private getRemovedStoreItem(
    updatedGearItems: GearItem[],
    prevGearItems: GearItem[]
  ): GearItem {
    let removedItem: GearItem = null;

    for (let index = 0; index < prevGearItems.length; index++) {
      const oldElement = prevGearItems[index];
      const indexElement = updatedGearItems.indexOf(oldElement);
      // if its greater than -1 it exists, if not it doesnt and thats the one we want
      if (indexElement == -1) {
        removedItem = oldElement;
      }
    }
    return removedItem;
  }

  getPagedItems(
    newGearItems: GearItem[],
    prevGearItems: GearItem[],
    pagedGearItems: GearItem[],
    pageSize: number,
    paginator: MatPaginator
  ): GearItem[] {
    // 1. If paginator length is 0, we are rendering new list
    if (paginator.length == 0) {
      return newGearItems.slice(0, pageSize);
    }
    // 2. If the newGearItems length is equal to the paginator length, we are updating the list. Return updated pagedGearItems from the newGearItems list
    else if (newGearItems.length === paginator.length) {
      let updatedPagedGearItems: GearItem[] = [];
      newGearItems.filter((newGearItem: GearItem) => {
        pagedGearItems.map((pagedGearItem: GearItem) => {
          if (pagedGearItem.ID == newGearItem.ID) {
            updatedPagedGearItems.push(newGearItem);
          }
        });
      });
      return updatedPagedGearItems;
    }
    // 3. if newGearItems are greater than the paginator length, we are adding new gear items
    else if (newGearItems.length > paginator.length) {
      // Since we are adding new gear item, we are navigating to the first page and adding the item to the array
      paginator.firstPage();
      return newGearItems.slice(0, pageSize);
    }
    // 4. pagedItems are greater than 0 and prevGearItems are greater than 6 this means we are displaying at least one page and we are on the second or n-th page displaying items.
    else if (pagedGearItems.length > 0 && prevGearItems.length > pageSize) {
      // 4.a If the pagedGearItems length is greater than 1, we just want to update that list by removing the removed gearItem and return the updated pagedGearItem array
      if (newGearItems.length < prevGearItems.length) {
        // Find the gearItem that has been removed
        const gearItemToRemove: GearItem = this.getRemovedStoreItem(
          newGearItems,
          prevGearItems
        );
        if (pagedGearItems.length > 1) {
          // Find out the index of the gearItem that needs to be removed from pagedGearItems array and then remove it and return the new list
          const pagedGearItemToRemoveIndex = pagedGearItems.indexOf(
            gearItemToRemove
          );
          const pagedGearItemsCopy: GearItem[] = [...pagedGearItems];
          pagedGearItemsCopy.splice(pagedGearItemToRemoveIndex, 1);
          // If paginator does not have next page. This means the page we are on is the last page;
          if (!paginator.hasNextPage()) {
            // Return updated pagedGearItem array
            return pagedGearItemsCopy;
          }
          // If paginator does have next page
          else if (paginator.hasNextPage()) {
            // Check if the newGearItems length is equal to the paginator length if it is, just return the newGearItems list as the list to paginate
            if (newGearItems.length === pagedGearItems.length) {
              return newGearItems;
            }
            const removedGearItemIndexOfTotal = prevGearItems.indexOf(
              gearItemToRemove
            );
            const indexToAddToTotal = pageSize - pagedGearItemToRemoveIndex;
            const indexOfNextGearItem =
              removedGearItemIndexOfTotal - 1 + indexToAddToTotal;
            const gearItemToAdd: GearItem = newGearItems[indexOfNextGearItem];

            pagedGearItemsCopy.splice(
              pagedGearItems.length - 1,
              0,
              gearItemToAdd
            );
            return pagedGearItemsCopy;
          }
        }
        // 5 If the pagedGearItems length is not greater than 1. It might be 1 or 0
        else {
          // If newGearItems length is smaller than or equal to the pageSize return whatever is left in newGearItems array
          if (newGearItems.length <= pageSize) {
            paginator.firstPage();
            return newGearItems.slice(0, newGearItems.length);
          } else {
            if (!paginator.hasNextPage() && paginator.hasPreviousPage()) {
              paginator.previousPage();
              return newGearItems.slice(newGearItems.length - pageSize);
            }
          }
        }
      }
    } else if (!paginator.hasNextPage() && !paginator.hasPreviousPage()) {
      return newGearItems;
    }
  }
}
