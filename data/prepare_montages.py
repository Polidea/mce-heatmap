import os

extract = [
    ["Closing", "closing"],
    ["FLASHTALKS_1_Matt_Harysymczuk", "flash-1-matt-harasymczuk"],
    ["FLASHTALKS_2_Lukasz_Gawin", "flash-2-lukasz-gawin"],
    ["FLASHTALKS_3_Oguz_Bastemur", "flash-3-oguz-bastemur"],
    ["FLASHTALKS_4_Piotr_Podziemski", "flash-4-piotr-podziemski"],
    ["FLASHTALKS_5_Lukasz_Stefaniszyn", "flash-5-lukasz-stefaniszyn"],
    ["FLASHTALKS_6_Krzysztof_Zablocki", "flash-6-krzysztof-zablocki"],
    ["Opening", "opening"],
    ["s1p1_Eric_Lafortune", "eric-lafortune"],
    ["s1p2_Wiebie_Elsinga", "wiebe-elsinga"],
    ["s1p3_Alex_Shirazi", "alex-shirazi"],
    ["s1p4_Cheng_Luo", "cheng-luo"],
    ["s1p5_Gal_Cerf", "gal-cerf"],
    ["s1p6_Cesare_Rocchi", "cesare-rocchi"],
    ["s1p7_Michele_Capra", "michele-capra"],
    ["s2p1_Mike_Lee", "mike-lee"],
    ["s2p2_Jackson_Gabbard", "jackson-gabbard"],
    ["s2p3_Kathryn_Rotondo", "kathryn-rotondo"],
    ["s2p4_Drew_Crawford_v1", "drew-crawford"],
    ["s2p5_Damian_Mehers", "damian-mehers"],
    ["s2p6_Rob_Rusher", "rob-rusher"],
    ["s2p7_Dave_Wiskus", "dave-wiskus"],
    ["s3p1_Chris_Eidhof", "chris-eidhof"],
    ["s3p2_Orta_Therox", "orta-therox"],
    ["s3p3_Jon_Reid", "jon-reid"],
    ["s3p4_Tom_Maes", "tom-maes"],
    ["s3p5_Peter_Steinberger", "peter-steinberger"],
    ["s3p6_John_Ellenich", "john-ellenich"],
    ["s3p7_Remy_Virin", "remy-virin"],
]

for video in extract:
    movie = video[0]
    identifier = video[1]
    command = "/usr/local/bin/convert ../snapshots/{identifier}-00001.jpg -resize 209x118 " \
              "../snapshots/sprites/{identifier}-texture.jpg" \
              "".format(identifier=identifier)
    print "Executing " + command
    os.system(command)
    command = "/usr/local/bin/montage -geometry 209x118 -size 2090x708 -background 'rgb(0,0,0)'" \
              " -tile 10x ../snapshots/{identifier}*.jpg" \
              " ../snapshots/sprites/{identifier}.jpg" \
              "".format(identifier=identifier)
    print "Executing " + command
    os.system(command)