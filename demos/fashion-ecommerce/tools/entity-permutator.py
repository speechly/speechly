from itertools import permutations
l = ["$color_phrase","$brand_phrase","$category_phrase","$sex_phrase","$size_phrase","$sort_phrase"]
temp = set()
# Print the obtained permutations
for i in range(2,5):
    print(i)
    perm = list(permutations(l,i))
    for permutation in list(perm):
        p = sorted(list(permutation))
        temp.add('|'.join(p))
temp = list(temp)
temp.sort(key=lambda x:len(x))
for t in temp:
    print('*filter {{$carrier_phrases}} ![{}] '.format(t))
