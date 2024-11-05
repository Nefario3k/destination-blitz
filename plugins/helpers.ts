import axios from "axios";
import defaultVals from "~/utils/defaultVals";
import { userAccountInfoStore } from "~/stores/accountInfos";
import { useAppResourceStore } from "~/stores/appResources";

export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  const nuxtLoader = useCustomLoadingIndicator();
  const { emit } = useEventBus();
  const appResourceStore = useAppResourceStore(nuxtApp.$pinia);
  const accountInfoStore = userAccountInfoStore(nuxtApp.$pinia);
  // const { data, token, signOut } = useAuth();
  const route = useRoute();

  return {
    provide: {
      getAppResource: (val: string) => appResourceStore[val],
      getAccountInfo: (val: string) => accountInfoStore[val],
      globalEmit: (val: string, payload: null = null) => emit(val, payload),
      deepClone: (obj: any) => {
        if (typeof obj !== "object" || obj === null) {
          return obj; // Handle primitive values
        }

        if (Array.isArray(obj)) {
          return obj.map(nuxtApp.$deepClone); // Recursively clone array elements
        }

        const clone: any = {};
        for (const key in obj) {
          if (key in obj) {
            clone[key] = nuxtApp.$deepClone(obj[key]); // Recursively clone object properties
          }
        }
        return clone;
      },

      formatTimeDialation: (num: number) => {
        // Check if the number is a valid positive number
        if (typeof num !== "number" || num < 0) {
          // Return an error message
          return "Invalid input";
        }
        // Initialize an empty string to store the output
        var output = "";
        // Define an array of time units and their corresponding values in seconds
        var units = [
          ["days", 86400], // 1 day = 86400 seconds
          ["hours", 3600], // 1 hour = 3600 seconds
          ["minutes", 60], // 1 minute = 60 seconds
          ["seconds", 1], // 1 second = 1 second
        ];
        // Loop through the array of units
        for (var i = 0; i < units.length; i++) {
          // Get the current unit and its value
          var unit: any = units[i][0];
          var value: any = units[i][1];
          // Calculate how many times the value fits into the number
          var count: any = Math.floor(num / value);
          // If the count is greater than zero, add it to the output with the unit
          if (count > 0) {
            output += count + unit + " ";
          } else output += 0 + unit + " ";
          // Update the number by subtracting the count times the value
          num -= count * value;
        }
        // Trim any extra space at the end of the output
        output = output.trim();
        // Return the output
        return output;
      },
      handleCardRoutePreserve: (path = "") => {
        let returnRoute = null;
        const mainPath = route.path;
        const mainQuery = route.query;
        const hasQuery = Object.keys(mainQuery).length;
        const userRoute = route.path.split("/").filter((element) => {
          const exclude = ["", "en", "es"];
          return !exclude.includes(element);
        });
        const userRouteLength = userRoute.length;
        const lastItem = route.path.split("/").pop();

        if (userRouteLength > 3 && userRoute[2].toLowerCase() === "preview") {
          if (path === "gallery") {
            if (lastItem === path) returnRoute = mainPath;
            else returnRoute = mainPath + "/gallery";
          } else {
            if (lastItem === "gallery")
              returnRoute = userRoute.slice(0, userRouteLength - 1);
            else returnRoute = mainPath;
          }
        } else {
          if (path === "gallery") {
            if (lastItem === path && userRouteLength === 3)
              returnRoute = mainPath;
            else returnRoute = mainPath + "/gallery";
          } else {
            if (lastItem === "gallery" && userRouteLength === 3)
              returnRoute = userRoute.slice(0, userRouteLength - 1);
            else returnRoute = mainPath;
          }
        }
        if (nuxtApp.$getType(returnRoute) === "array") {
          returnRoute = "/" + returnRoute.join("/");
        } else returnRoute = returnRoute.replace("//", "/");
        if (hasQuery)
          returnRoute = `${returnRoute}?${nuxtApp.$setSearchParams(mainQuery)}`;
        return returnRoute;
      },
      setSearchParams: (searchParam: any) => {
        let params = "";
        Object.entries(searchParam).forEach(([key, value]) => {
          if (value || value === 0) {
            params += `${key}=${value}&`;
          }
        });
        return params;
      },
      getType: (value: any) => {
        const typeStr = typeof value;

        // Handle special cases for more precise typing
        if (typeStr === "object") {
          if (value === null) {
            return "null";
          } else if (Array.isArray(value)) {
            return "array";
          } else if (value instanceof Date) {
            return "date";
          } else if (value instanceof RegExp) {
            return "regexp";
          } else {
            return "object";
          }
        } else {
          return typeStr;
        }
      },
      getUser: () => {
        // if (data.value?.data) {
        //   return { ...data.value?.data };
        // }
        return defaultVals.user;
      },
      logOutUser: async () => {
        return;
        // Show loading
        // nuxtLoader.start();
        // await signOut({ callbackUrl: localePath("/login"), redirect: true });
        // nuxtLoader.finish();
        // emit("success", {
        //   prop: nuxtApp.$i18n.t("A251"),
        //   header: "User logout",
        // });
        // appResourceStore.resetState();
        // accountInfoStore.resetState();
        // return navigateTo({
        //   path: nuxtApp.$localePath("/login"),
        //   replace: false,
        // });
      },
      capitalizeWord: (string: string) => {
        // Split the string by spaces and underscores
        const words = string.split(/[_\s]+/);

        // Capitalize each word
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        return words.join(" ");
      },
      capitalizeWords: (words: string) => {
        // split the above string into an array
        const arr = words.split(" ");

        //   loop through each element of the array and capitalize the first letters
        for (var i = 0; i < arr.length; i++) {
          arr[i] =
            arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
        }

        //   join all the elements of the array back into a string using a blankspace as a separator
        return arr.join(" ");
      },
      capitalizeFirstLetter: (str: string) => {
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

        return capitalized;
      },
      convertStringToSlug: (str: string) => {
        return str.toLowerCase().split(" ").join("-");
      },
      getLocalStorage: (name: string) => {
        window.localStorage.getItem(name ? name : "h3eddrrw");
      },
      commitToLocalStorage: (name: string | null, payload: any) => {
        window.localStorage.setItem(
          name ? name : "h3eddrrw",
          name ? payload : JSON.stringify(payload)
        );
      },
      removeLocalStorage: (name: string | null = null) => {
        window.localStorage.removeItem(name ? name : "h3eddrrw");
      },
      getVideoThumbnail: (url: string, quality = null) => {
        if (url) {
          var video_id, thumbnail, result;
          if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
            video_id = result[0]?.split("/")?.pop();
            if (video_id) {
              if (typeof quality == "undefined") {
                quality = "high";
              }

              var quality_key = "maxresdefault"; // Max quality
              if (quality == "low") {
                quality_key = "sddefault";
              } else if (quality == "medium") {
                quality_key = "mqdefault";
              } else if (quality == "high") {
                quality_key = "hqdefault";
              }

              var thumbnail =
                "https://i3.ytimg.com/vi/" +
                video_id +
                "/" +
                quality_key +
                ".jpg";
              return thumbnail;
            }
          } else if ((result = url.match(/youtu.be\/(.{11})/))) {
            video_id = result.pop();

            if (video_id) {
              if (typeof quality == "undefined") {
                quality = "high";
              }

              var quality_key = "maxresdefault"; // Max quality
              if (quality == "low") {
                quality_key = "sddefault";
              } else if (quality == "medium") {
                quality_key = "mqdefault";
              } else if (quality == "high") {
                quality_key = "hqdefault";
              }

              var thumbnail =
                "http://img.youtube.com/vi/" +
                video_id +
                "/" +
                quality_key +
                ".jpg";
              return thumbnail;
            }
          }

          return "/gallery1.png";
        }
        return false;
      },
      getBaseUrl: () => {
        return window.location.origin;
      },
      getKebabCase: (str: string) => {
        if (!str) return null;
        return str.toLowerCase().split(" ").join("_");
      },
      removeKebabCase: (str: string) => {
        if (!str) return null;
        return str.toLowerCase().split("_").join(" ");
      },
      removeHttp: (url: string) => {
        return url.replace(/^https?:\/\//, "");
      },
      linkCheck: (url: string) => {
        if (!url) return "javascript:void(0)";
        let filterLinks = [
          {
            stringsToCheck: ["https://", "http://"],
            value: "https://" + url,
          },
        ];

        if (
          url.includes(filterLinks[0].stringsToCheck[0]) ||
          url.includes(filterLinks[0].stringsToCheck[1])
        ) {
          return url;
        } else {
          return filterLinks[0].value;
        }
      },
      formatCurrency: (num = 0, formatType = "NGN", formatLang = "en-NG") => {
        // if (num === null) return 'Not available'
        if (num === null) return "0";
        const formatter = new Intl.NumberFormat(formatLang, {
          style: "currency",
          currency: formatType,
          currencyDisplay: "symbol",
          minimumFractionDigits: 0, // No decimal places
          maximumFractionDigits: 2, // No decimal places
        });
        return formatter.format(num);
      },
      formatNumber: (num: any) => {
        if (num === null || num === undefined || num === "") return 0;
        const formatter = num.toLocaleString("en-US", {
          style: "decimal",
        });
        return formatter;
      },
      formatNumberReview: (num: any) => {
        if (!num || !Number(num)) return 0;
        if (num < 1000) {
          return num;
        } else if (num < 1000000) {
          return (num / 1000).toFixed(0) + "K";
        } else if (num < 1000000000) {
          return (num / 1000000).toFixed(0) + "M";
        } else {
          return (num / 1000000000).toFixed(0) + "B";
        }
      },
      formatCurrencyReview: (
        num = 0,
        formatType = "NGN",
        formatLang = "en-NG"
      ) => {
        if (num === null) return 0;
        const formattedNumCurrency = nuxtApp.$formatCurrency(
          num,
          formatType,
          formatLang
        );
        let val = "";
        if (num < 1000) {
          val = "";
        } else if (num < 1000000) {
          val = "K";
        } else if (num < 1000000000) {
          val = "M";
        } else if (num < 1000000000000) {
          val = "B";
        } else if (num < 1000000000000000) {
          val = "T";
        } else {
          val = "ee";
        }
        const numLength = num.toString().length;
        if (
          (!formattedNumCurrency && !val) ||
          (formattedNumCurrency && numLength < 4 && !val)
        )
          return formattedNumCurrency;
        else if (val !== "ee") {
          let formatLength = numLength - 2;
          const modulo = numLength % 3;
          if (!modulo) formatLength = 4;
          else formatLength = 3;
          const returnedVal = formattedNumCurrency.slice(0, formatLength) + val;
          return returnedVal.replace(`,${val}`, val);
        } else return nuxtApp.$formatNumber(num);
      },
      getInitials: (name: any) => {
        if (!name) return "Nil";
        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

        let initials = [...name.matchAll(rgx)] || [];

        initials = (
          (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
        ).toUpperCase();

        return initials;
      },
      removeDuplicates: (arr: any, prop: any = null) => {
        const uniqueValues = new Set()
        return arr.filter(function (item: any) {
          if (prop) {
            if (item[prop] === null || !uniqueValues.has(item[prop])) {
              uniqueValues.add(item[prop])
              return true
            }
            return false
          } else {
            if (item === null || !uniqueValues.has(item)) {
              uniqueValues.add(item)
              return true
            }
            return false
          }
        })
      },
      shuffleArray: (arr: any) => {
        arr.sort(() => Math.random() - 0.5);
        return arr;
      },
      getFilesize: (filesize: any, decimalPoint: any) => {
        if (filesize == 0) return "0 Bytes";
        var k = 1000,
          dm = decimalPoint || 2,
          sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
          i = Math.floor(Math.log(filesize) / Math.log(k));
        return (
          parseFloat((filesize / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
      },
      slugify: (string: string) => {
        const slug = string
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");

        return slug;
      },
      groupResultsByFirstCharacter: (results: any) => {
        let data = results.reduce((r, e) => {
          // get first letter of name of current element
          let alphabet = e.name[0];

          // if there is no property in accumulator with this letter create it
          if (!r[alphabet]) r[alphabet] = { alphabet, records: [e] };
          // if there is push current element to children array for that letter
          else r[alphabet].records.push(e);

          // return accumulator
          return r;
        }, {});

        let result = Object.values(data);
        return result;
      },
      formatDate: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const newDate = new Date(inputDate);
        const options = { day: "numeric", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("en-NG", options).format(
          newDate
        );
        return formattedDate;
      },
      formatTableDate: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const addOrdinalSuffix = (day) => {
          if (day >= 11 && day <= 13) {
            return `${day}th`;
          }
          switch (day % 10) {
            case 1:
              return `${day}st`;
            case 2:
              return `${day}nd`;
            case 3:
              return `${day}rd`;
            default:
              return `${day}th`;
          }
        };
        const newDate = new Date(inputDate);
        const options = { day: "numeric", month: "short", year: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          newDate
        );

        // Extract day, month, and year
        const day = newDate.getDate();
        const month = formattedDate.split(" ")[0];
        const year = formattedDate.split(" ")[2];

        // Add ordinal suffix to the day
        const dayWithOrdinal = addOrdinalSuffix(day);

        // Concatenate the formatted date
        const result = `${month} ${dayWithOrdinal}, ${year}`;

        return result;
      },
      formatDateSimple: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const dates = new Date(inputDate);
        const year = dates.getFullYear();
        const month = String(dates.getMonth() + 1).padStart(2, "0");
        const day = String(dates.getDate()).padStart(2, "0");

        return `${month}-${day}-${year}`;
      },
      formatDateSimple2: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const dates = new Date(inputDate);
        const year = dates.getFullYear();
        const month = String(dates.getMonth() + 1).padStart(2, "0");
        const day = String(dates.getDate()).padStart(2, "0");

        return `${month}/${day}/${year}`;
      },
      formatDateTime: (inputDate: string) => {
        if (
          inputDate === null ||
          inputDate === "00-00-00" ||
          inputDate === undefined ||
          inputDate === ""
        )
          return "Not available";
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };

        const formattedDate = new Intl.DateTimeFormat("en-NG", options).format(
          new Date(inputDate)
        );
        // inputDate.toLocaleString("en-US", options);
        const parts = formattedDate.split(" ");

        return `${parts[0]} ${parts[1]}, ${parts[2]}. ${parts[3]} ${parts[4]} ${parts[5]}`;
      },
      getYouTubeVideoTitle: async (url: string) => {
        try {
          // Make an HTTP GET request to the YouTube video page
          const response = await axios.get(url);
          const html = response.data;

          // Parse the HTML response using Cheerio
          const $ = cheerio.load(html);

          // Extract the video title from the parsed HTML
          const title = $('meta[property="og:title"]').attr("content");

          return title;
        } catch (error) {
          return null;
        }

        // Usage example
        // const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        // getYouTubeVideoTitle(videoUrl)
        //   .then(title => {
        //   });
      },
      getDevicePlatform: () => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
          return "Android";
        } else if (isiOS) {
          return "iOS";
        } else {
          return "Unknown";
        }
      },
      getAppStoreLink: () => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
          return "https://play.google.com/store/apps/details?id=com.bexit.bizcard";
        } else if (isiOS) {
          return "https://apps.apple.com/us/app/beezlinq/id1671817392";
        } else {
          return "https://beezlinq.com";
        }
      },
    },
  };
});
